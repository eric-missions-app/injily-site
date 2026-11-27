DROP INDEX IF EXISTS "organizations_name_country_unique";--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "country" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "people" ADD COLUMN "name" text;--> statement-breakpoint
UPDATE "people" SET "name" = "first_name" || ' ' || "last_name";--> statement-breakpoint
ALTER TABLE "people" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "organizations_name_country_unique" ON "organizations" USING btree (lower("name"),coalesce("country", ''));--> statement-breakpoint
ALTER TABLE "people" DROP COLUMN IF EXISTS "first_name";--> statement-breakpoint
ALTER TABLE "people" DROP COLUMN IF EXISTS "last_name";
