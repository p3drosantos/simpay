ALTER TABLE "tickets" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "stripeSessionId" text;