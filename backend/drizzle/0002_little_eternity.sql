ALTER TABLE "predictions" DROP CONSTRAINT "predictions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "predictions" ALTER COLUMN "temperature" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "predictions" ALTER COLUMN "temperature" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "predictions" ALTER COLUMN "rainfall" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "predictions" ALTER COLUMN "rainfall" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "predictions" ALTER COLUMN "humidity" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "predictions" ALTER COLUMN "humidity" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "predictions" ALTER COLUMN "soil_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "predictions" ALTER COLUMN "crop_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "predictions" ALTER COLUMN "fertilizer" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "predictions" ALTER COLUMN "area" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "predictions" ALTER COLUMN "area" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "predictions" ALTER COLUMN "predicted_yield" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "predictions" ALTER COLUMN "predicted_yield" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "predictions" ALTER COLUMN "actual_yield" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "predictions" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;