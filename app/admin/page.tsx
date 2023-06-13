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

export default function IndexPage() {
  async function startMigration() {
    "use server";
    const db = drizzle(sql);
    await migrate(db, { migrationsFolder: "db/migrations" })
    console.log("Migration complete");
  }

  return (
    <section className="container grid items-center justify-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Admin Panel.
        </h1>
      </div>

      <form action={startMigration} className="flex gap-4">
        <Button type="submit">Migrate Database</Button>
      </form>
    </section>
  )
}
