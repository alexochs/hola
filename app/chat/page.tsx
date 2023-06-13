import Link from "next/link"
import { redirect } from 'next/navigation'

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import { dbChatScenes, dbChats } from "@/db/schema";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

export default async function ScenesPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }

  const db = drizzle(sql);
  const chats = await db.select().from(dbChats).where(eq(dbChats.userId, user.id));

  return (
    <section className="container grid items-center justify-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Continue chatting.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Pick up a conversation where you left off.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {chats.map((chat) => (
          <Card key={chat.id}>
            <CardHeader>
              <CardTitle>Chat {chat.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Scene {chat.sceneId}</CardDescription>
            </CardContent>
            <CardFooter>
              <Link href={`/chat/${chat.sceneId}/${chat.id}`}>
                <Button>Open Chat</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
