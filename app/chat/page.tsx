import Link from "next/link"

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

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import { Mic, Smile } from "lucide-react"
import { Configuration, OpenAIApi } from "openai"
import Error from "next/error"

export default function IndexPage() {
  async function startChat() {
    "use server";

    console.log("Starting chat...");

    const configuration = new Configuration({
      apiKey: "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",
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "assistant",
          content: "Your name is John Doe. You are the user's new friend. Your goal is to have a conversation with the user. Be friendly and funny. Keep the conversation going.",
        }
      ]
    });

    const message = response.data.choices[0].message;
    if (!message) {
      console.error("No message returned from OpenAI");
      return;
    }
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

      <Card>
        <CardHeader>
          <CardTitle>Dialogue</CardTitle>
          <CardDescription>Chat with the AI here</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="chat chat-start">
            <Button variant="outline" className="w-10 chat-image rounded-full p-0">
              <Smile className="h-6 w-6" />
            </Button>
            <div className="chat-bubble text-sm">It was said that you would, destroy the Sith, not join them.</div>
          </div>

          <div className="chat chat-end">
            <Button variant="outline" className="w-10 chat-image rounded-full p-0">
              <Smile className="h-6 w-6" />
            </Button>
            <div className="chat-bubble chat-bubble-primary text-sm">It was said that you would, destroy the Sith, not join them.</div>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="outline" className="w-10 rounded-full p-0">
            <Mic className="h-4 w-4" />
            <span className="sr-only">Speak</span>
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}
