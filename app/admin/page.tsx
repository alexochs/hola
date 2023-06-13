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
import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { dbChatScenes } from "@/db/schema"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

export default async function IndexPage() {
  const db = drizzle(sql);
  const chatScenes: any[] = await db.select().from(dbChatScenes);

  async function startMigration() {
    "use server";
    const db = drizzle(sql);
    await migrate(db, { migrationsFolder: "db/migrations" })
    console.log("Migration complete");
  }

  async function createChatScene(data: FormData) {
    "use server";

    const name = data.get("name") as string;
    const description = data.get("description") as string;
    const framing = data.get("framing") as string;

    if (!name || !description || !framing) {
      console.error("Missing required fields");
      return;
    }

    const db = drizzle(sql);
    const result = await db.insert(dbChatScenes).values({
      name,
      description,
      framing,
    });

    if (!result) {
      console.error("Failed to create chat scene");
      return;
    }

    revalidatePath("/admin");
  }

  async function deleteChatScene(data: FormData) {
    "use server";

    const id = parseInt(data.get("id") as string);

    if (!id) {
      console.error("Missing required id");
      return;
    }

    const db = drizzle(sql);
    const result = await db.delete(dbChatScenes).where(eq(dbChatScenes.id, id));

    if (!result) {
      console.error("Failed to delete chat scene");
      return;
    }

    revalidatePath("/admin");
  }

  return (
    <section className="container grid items-center justify-center gap-16 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Admin Panel.
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Database</h2>
        <form action={startMigration} className="flex gap-4">
          <Button type="submit">Migrate Database</Button>
        </form>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Chat Scenes</h2>
        <form action={createChatScene}>
          <Card className="w-96">
            <CardHeader>
              <CardTitle>New Chat Scene</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-8">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" />
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" />
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="framing">Framing</Label>
                <Textarea id="framing" name="framing" />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Create</Button>
            </CardFooter>
          </Card>
        </form>

        <div className="flex flex-col gap-4">
          {chatScenes.map((chatScene) => (
            <form action={deleteChatScene}>
              <Card key={chatScene.id} className="w-96">
                <CardHeader>
                  <CardTitle>{chatScene.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{chatScene.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <input type="hidden" name="id" value={chatScene.id} />
                  <Button type="submit" variant="destructive" className="w-full">Delete</Button>
                </CardFooter>
              </Card>
            </form>
          ))}
        </div>
      </div>
    </section >
  )
}
