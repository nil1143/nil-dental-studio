CREATE TYPE "public"."locale" AS ENUM('en', 'pl');--> statement-breakpoint
CREATE TABLE "blocked_times" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	CONSTRAINT "blocked_times_valid_range" CHECK ("blocked_times"."ends_at" > "blocked_times"."starts_at")
);
--> statement-breakpoint
CREATE TABLE "service_translations" (
	"service_id" uuid NOT NULL,
	"locale" "locale" NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"details" text[] NOT NULL,
	"expect" text[] NOT NULL,
	CONSTRAINT "service_translations_service_id_locale_pk" PRIMARY KEY("service_id","locale")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"duration_minutes" integer NOT NULL,
	"price_cents" integer NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug"),
	CONSTRAINT "services_slug_format" CHECK ("services"."slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	CONSTRAINT "services_duration_positive" CHECK ("services"."duration_minutes" > 0),
	CONSTRAINT "services_price_non_negative" CHECK ("services"."price_cents" >= 0)
);
--> statement-breakpoint
CREATE TABLE "working_hours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"day_of_week" smallint NOT NULL,
	"opens" time(0),
	"closes" time(0),
	CONSTRAINT "working_hours_day_of_week_unique" UNIQUE("day_of_week"),
	CONSTRAINT "working_hours_iso_day" CHECK ("working_hours"."day_of_week" BETWEEN 1 AND 7),
	CONSTRAINT "working_hours_open_close_pair" CHECK (("working_hours"."opens" IS NULL) = ("working_hours"."closes" IS NULL)),
	CONSTRAINT "working_hours_opens_before_closes" CHECK ("working_hours"."opens" < "working_hours"."closes")
);
--> statement-breakpoint
ALTER TABLE "service_translations" ADD CONSTRAINT "service_translations_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;