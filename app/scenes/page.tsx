import Link from "next/link"
import { redirect } from 'next/navigation'

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import { dbChatScenes, dbChats } from "@/db/schema";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@clerk/nextjs";

export default async function ScenesPage() {
  const db = drizzle(sql);
  const scenes = await db.select().from(dbChatScenes);

  async function startScene(data: FormData) {
    "use server";

    const { userId } = auth();
    if (!userId) {
      throw new Error('You must be signed in to add an item to your cart');
    }

    const sceneId = parseInt(data.get("sceneId") as string);
    if (!sceneId) {
      throw new Error('No scene ID provided');
    }

    const db = drizzle(sql);
    const chat = await db.insert(dbChats).values({
      userId: userId,
      sceneId: sceneId,
    }).returning();

    if (!chat[0]) {
      throw new Error('Failed to create chat');
    }

    redirect(`/chat/${sceneId}/${chat[0].id}`);
  }

  return (
    <section className="container grid items-center justify-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Pick a scene.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Choose from a variety of scenes to start your conversation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {scenes.map((scene) => (
          <Card key={scene.id}>
            <CardHeader>
              <CardTitle>{scene.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{scene.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <form action={startScene}>
                <input type="hidden" name="sceneId" value={scene.id} />
                <Button>Start</Button>
              </form>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
