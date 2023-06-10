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
import { Mic } from "lucide-react"

export default function IndexPage() {
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

      <div className="flex gap-4">
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

        <Button>Start Chat</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dialogue</CardTitle>
          <CardDescription>Chat with the AI here</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
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
