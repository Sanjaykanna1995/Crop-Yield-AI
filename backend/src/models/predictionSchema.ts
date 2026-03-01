import { pgTable, uuid, varchar, numeric, timestamp } from "drizzle-orm/pg-core";
import { users } from "./userSchema";

export const predictions = pgTable("predictions", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),

  temperature: numeric("temperature"),
  rainfall: numeric("rainfall"),
  humidity: numeric("humidity"),
  soilType: varchar("soil_type", { length: 100 }),
  cropType: varchar("crop_type", { length: 100 }),
  fertilizer: varchar("fertilizer", { length: 100 }),
  area: numeric("area"),

  predictedYield: numeric("predicted_yield"),
  actualYield: numeric("actual_yield"),

  createdAt: timestamp("created_at").defaultNow(),
});