import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

/* =========================
   USERS TABLE
========================= */

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  password: text("password").notNull(),

  role: varchar("role", { length: 20 })
    .notNull()
    .default("user"),
});

/* =========================
   PREDICTIONS TABLE
========================= */

export const predictions = pgTable("predictions", {
  id: uuid("id").defaultRandom().primaryKey(),

  user_id: uuid("user_id").notNull(),

  temperature: integer("temperature").notNull(),

  rainfall: integer("rainfall").notNull(),

  humidity: integer("humidity").notNull(),

  soil_type: varchar("soil_type", { length: 100 }).notNull(),

  crop_type: varchar("crop_type", { length: 100 }).notNull(),

  predicted_yield: integer("predicted_yield").notNull(),

  // ✅ THIS WAS MISSING
  actual_yield: integer("actual_yield"),

  created_at: timestamp("created_at").defaultNow(),
});