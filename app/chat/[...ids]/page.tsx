import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Mic, Smile } from "lucide-react"
import Error from "next/error"

import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { dbChatLogs } from "@/db/schema"
import { Configuration, OpenAIApi } from "openai"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { currentUser } from "@clerk/nextjs"

export default async function ChatPage({ params }: { params: { ids: string[] } }) {
  const user = await currentUser();
  const db = drizzle(sql);
  const chatLogs = await db.select().from(dbChatLogs);

  async function startChat() {
    "use server";

    const configuration = new Configuration({
      apiKey: "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",
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Your name is John Doe. Your goal is to have a conversation with the user, start by introducing yourself. Be friendly, funny and relatable. Keep the conversation going. Make your responses short so the user can understand and read them comfortably.",
        }
      ]
    });

    const message = response.data.choices[0].message;
    if (!message) {
      console.error("No message returned from OpenAI");
      return;
    }

    const db = drizzle(sql);
    const result = await db.insert(dbChatLogs).values({
      role: message.role,
      content: message.content,
    });

    if (!result) {
      console.error("Failed to insert chat log into database");
      return;
    }

    revalidatePath("/chat");
  }

  async function deleteChatLog(data: FormData) {
    "use server";

    const id = parseInt(data.get("id") as string);
    if (!id) {
      console.error("Invalid chat log ID to delete");
      return;
    }

    const db = drizzle(sql);
    const result = await db.delete(dbChatLogs).where(eq(dbChatLogs.id, id));
    if (!result) {
      console.error("Failed to delete chat log from database");
      return;
    }

    revalidatePath("/chat");
  }

  async function sendMessage(data: FormData) {
    "use server";

    const message = data.get("message") as string;
    if (!message) {
      console.error("Invalid message to send");
      return;
    }

    const configuration = new Configuration({
      apiKey: "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",
    });
    const openai = new OpenAIApi(configuration);

    const db = drizzle(sql);
    const chatLogs = await db.select().from(dbChatLogs);

    const history = chatLogs.map((log) => {
      return {
        role: log.role as "user" | "assistant" | "system",
        content: log.content,
      }
    });

    console.log("history", history);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Your name is John Doe. Your goal is to have a conversation with the user, start by introducing yourself. Be friendly, funny and relatable. Keep the conversation going. Make your responses short so the user can understand and read them comfortably.",
        },
        ...history,
        {
          role: "user",
          content: message,
        }
      ]
    });

    const aiMessage = response.data.choices[0].message;
    if (!aiMessage) {
      console.error("No message returned from OpenAI");
      return;
    }

    const userResult = await db.insert(dbChatLogs).values({
      role: "user",
      content: message,
    });
    if (!userResult) {
      console.error("Failed to insert user chat log into database");
      return;
    }

    const aiResult = await db.insert(dbChatLogs).values({
      role: aiMessage.role,
      content: aiMessage.content,
    });
    if (!aiResult) {
      console.error("Failed to insert AI chat log into database");
      return;
    }

    revalidatePath("/chat");
  }

  return (
    <section className="container grid items-center justify-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Start a new dialogue.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Choose a language and start speaking with the AI.
        </p>
      </div>

      <form action={startChat} className="flex gap-4">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Language</SelectLabel>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="german">German</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button type="submit">Start Chat</Button>
      </form>

      <Card className="w-full sm:w-[980px]">
        <CardHeader>
          <CardTitle>Dialogue</CardTitle>
          <CardDescription>Chat with the AI here</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {chatLogs.map((chatLog) => (
            <div className={"chat " + (chatLog.role === "assistant" ? "chat-start" : "chat-end")}>
              <Button variant="outline" className="chat-image w-10 rounded-full p-0">
                <Smile className="h-6 w-6" />
              </Button>
              <div className="chat-bubble text-sm">{chatLog.content}</div>
              <form action={deleteChatLog}>
                <input type="hidden" name="id" value={chatLog.id} />
                <Button variant="link" className="text-xs">Delete this response</Button>
              </form>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex">
          <form action={sendMessage} className="flex w-full justify-center gap-2">
            <Button variant="outline" type="button"><Mic className="h-4 w-4" /></Button>
            <Input type="text" name="message" />
            <Button type="submit" disabled={!chatLogs.length}><Icons.send className="h-4 w-4" /></Button>
          </form>
        </CardFooter>
      </Card>
    </section>
  )
}
