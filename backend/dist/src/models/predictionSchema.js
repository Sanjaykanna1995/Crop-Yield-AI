"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const userSchema_1 = require("./userSchema");
exports.predictions = (0, pg_core_1.pgTable)("predictions", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)("user_id")
        .references(() => userSchema_1.users.id)
        .notNull(),
    temperature: (0, pg_core_1.numeric)("temperature"),
    rainfall: (0, pg_core_1.numeric)("rainfall"),
    humidity: (0, pg_core_1.numeric)("humidity"),
    soilType: (0, pg_core_1.varchar)("soil_type", { length: 100 }),
    cropType: (0, pg_core_1.varchar)("crop_type", { length: 100 }),
    fertilizer: (0, pg_core_1.varchar)("fertilizer", { length: 100 }),
    area: (0, pg_core_1.numeric)("area"),
    predictedYield: (0, pg_core_1.numeric)("predicted_yield"),
    actualYield: (0, pg_core_1.numeric)("actual_yield"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
