CREATE TABLE IF NOT EXISTS "chatlogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" text,
	"content" text
);
