import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <section className="container grid items-center justify-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Learn languages by speaking.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Hola is a language learning platform that uses AI to help you learn languages faster and more effectively.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={"/scenes"}
          className={buttonVariants()}
        >
          Get started
        </Link>
      </div>
    </section>
  )
}
