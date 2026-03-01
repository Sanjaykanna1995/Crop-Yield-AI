"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 150 }).notNull().unique(),
    password: (0, pg_core_1.varchar)("password", { length: 255 }).notNull(),
    role: (0, pg_core_1.varchar)("role", { length: 20 })
        .notNull()
        .default("user"), // user | admin
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
