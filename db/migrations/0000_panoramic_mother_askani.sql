CREATE TABLE IF NOT EXISTS "ChatLogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"chatId" varchar NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "ChatScenes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text NOT NULL,
	"framing" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "Chats" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar NOT NULL,
	"sceneId" integer NOT NULL
);
