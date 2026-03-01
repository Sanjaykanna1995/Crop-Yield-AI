"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictions = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
/* =========================
   USERS TABLE
========================= */
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    role: (0, pg_core_1.varchar)("role", { length: 20 })
        .notNull()
        .default("user"),
});
/* =========================
   PREDICTIONS TABLE
========================= */
exports.predictions = (0, pg_core_1.pgTable)("predictions", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    user_id: (0, pg_core_1.uuid)("user_id").notNull(),
    temperature: (0, pg_core_1.integer)("temperature").notNull(),
    rainfall: (0, pg_core_1.integer)("rainfall").notNull(),
    humidity: (0, pg_core_1.integer)("humidity").notNull(),
    soil_type: (0, pg_core_1.varchar)("soil_type", { length: 100 }).notNull(),
    crop_type: (0, pg_core_1.varchar)("crop_type", { length: 100 }).notNull(),
    predicted_yield: (0, pg_core_1.integer)("predicted_yield").notNull(),
    // ✅ THIS WAS MISSING
    actual_yield: (0, pg_core_1.integer)("actual_yield"),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
