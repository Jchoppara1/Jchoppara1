import { pgTable, uuid, text, integer, timestamp, boolean, doublePrecision, json, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const wines = pgTable("wines", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  grape: text("grape").notNull(),
  category: text("category").notNull(),
  origin: text("origin").notNull(),
  price: integer("price").notNull(),
  notes: text("notes").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const foods = pgTable("foods", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const evidenceCache = pgTable("evidence_cache", {
  id: uuid("id").defaultRandom().primaryKey(),
  queryKey: text("query_key").notNull(),
  mode: text("mode").notNull(),
  inputsHash: text("inputs_hash").notNull(),
  items: json("items").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
}, (t) => [
  unique().on(t.queryKey, t.mode, t.inputsHash),
]);

export const pairingRequests = pgTable("pairing_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  mode: text("mode").notNull(),
  inputs: json("inputs").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pairingResults = pgTable("pairing_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  requestId: uuid("request_id").notNull().references(() => pairingRequests.id),
  results: json("results").notNull(),
  confidence: integer("confidence").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sourceDomains = pgTable("source_domains", {
  id: uuid("id").defaultRandom().primaryKey(),
  domain: text("domain").notNull().unique(),
  tier: text("tier").notNull(),
  weight: doublePrecision("weight").notNull(),
  enabled: boolean("enabled").default(true).notNull(),
});

export const pairingRequestsRelations = relations(pairingRequests, ({ many }) => ({
  results: many(pairingResults),
}));

export const pairingResultsRelations = relations(pairingResults, ({ one }) => ({
  request: one(pairingRequests, {
    fields: [pairingResults.requestId],
    references: [pairingRequests.id],
  }),
}));

export type Wine = typeof wines.$inferSelect;
export type InsertWine = typeof wines.$inferInsert;
export type Food = typeof foods.$inferSelect;
export type InsertFood = typeof foods.$inferInsert;
export type SourceDomain = typeof sourceDomains.$inferSelect;
export type PairingRequest = typeof pairingRequests.$inferSelect;
export type PairingResult = typeof pairingResults.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type EvidenceCache = typeof evidenceCache.$inferSelect;

export const insertWineSchema = createInsertSchema(wines).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFoodSchema = createInsertSchema(foods).omit({ id: true, createdAt: true, updatedAt: true });
