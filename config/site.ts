export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Hola",
  description:
    "Hola is a language learning platform that uses AI to help you learn languages faster and more effectively.",
  mainNav: [
    {
      title: "Scenes",
      href: "/scenes",
    },
    {
      title: "My Chats",
      href: "/chat",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
    newChat: "/chat",
  },
}
