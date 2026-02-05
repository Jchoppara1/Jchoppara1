module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/schema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adminUsers",
    ()=>adminUsers,
    "evidenceCache",
    ()=>evidenceCache,
    "foods",
    ()=>foods,
    "insertFoodSchema",
    ()=>insertFoodSchema,
    "insertWineSchema",
    ()=>insertWineSchema,
    "pairingRequests",
    ()=>pairingRequests,
    "pairingRequestsRelations",
    ()=>pairingRequestsRelations,
    "pairingResults",
    ()=>pairingResults,
    "pairingResultsRelations",
    ()=>pairingResultsRelations,
    "sourceDomains",
    ()=>sourceDomains,
    "wines",
    ()=>wines
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/table.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/uuid.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/text.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/integer.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/timestamp.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/boolean.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$double$2d$precision$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/double-precision.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$json$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/json.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$unique$2d$constraint$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/unique-constraint.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/relations.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$zod$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-zod/index.mjs [app-route] (ecmascript)");
;
;
;
const wines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("wines", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("id").defaultRandom().primaryKey(),
    name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("name").notNull(),
    grape: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("grape").notNull(),
    category: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("category").notNull(),
    origin: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("origin").notNull(),
    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("price").notNull(),
    notes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("notes").notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").defaultNow().notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("updated_at").defaultNow().notNull()
});
const foods = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("foods", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("id").defaultRandom().primaryKey(),
    name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("name").notNull(),
    category: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("category").notNull(),
    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("price").notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").defaultNow().notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("updated_at").defaultNow().notNull()
});
const evidenceCache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("evidence_cache", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("id").defaultRandom().primaryKey(),
    queryKey: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("query_key").notNull(),
    mode: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("mode").notNull(),
    inputsHash: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("inputs_hash").notNull(),
    items: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$json$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["json"])("items").notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").defaultNow().notNull(),
    expiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("expires_at").notNull()
}, (t)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$unique$2d$constraint$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unique"])().on(t.queryKey, t.mode, t.inputsHash)
    ]);
const pairingRequests = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("pairing_requests", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("id").defaultRandom().primaryKey(),
    mode: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("mode").notNull(),
    inputs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$json$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["json"])("inputs").notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").defaultNow().notNull()
});
const pairingResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("pairing_results", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("id").defaultRandom().primaryKey(),
    requestId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("request_id").notNull().references(()=>pairingRequests.id),
    results: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$json$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["json"])("results").notNull(),
    confidence: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("confidence").notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").defaultNow().notNull()
});
const adminUsers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("admin_users", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("id").defaultRandom().primaryKey(),
    email: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("email").notNull().unique(),
    passwordHash: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("password_hash").notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").defaultNow().notNull()
});
const sourceDomains = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("source_domains", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])("id").defaultRandom().primaryKey(),
    domain: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("domain").notNull().unique(),
    tier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("tier").notNull(),
    weight: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$double$2d$precision$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["doublePrecision"])("weight").notNull(),
    enabled: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"])("enabled").default(true).notNull()
});
const pairingRequestsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(pairingRequests, ({ many })=>({
        results: many(pairingResults)
    }));
const pairingResultsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(pairingResults, ({ one })=>({
        request: one(pairingRequests, {
            fields: [
                pairingResults.requestId
            ],
            references: [
                pairingRequests.id
            ]
        })
    }));
const insertWineSchema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$zod$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createInsertSchema"])(wines).omit({
    id: true,
    createdAt: true,
    updatedAt: true
});
const insertFoodSchema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$zod$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createInsertSchema"])(foods).omit({
    id: true,
    createdAt: true,
    updatedAt: true
});
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/node-postgres/driver.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import, [project]/node_modules/pg)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/schema.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__["Pool"]({
    connectionString: process.env.DATABASE_URL
});
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["drizzle"])(pool, {
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/lib/pairingRules.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "explainPairing",
    ()=>explainPairing,
    "getFoodRecommendations",
    ()=>getFoodRecommendations,
    "getWineRecommendations",
    ()=>getWineRecommendations
]);
const wineColorKeywords = {
    red: [
        "cabernet",
        "merlot",
        "pinot noir",
        "syrah",
        "shiraz",
        "malbec",
        "tempranillo",
        "sangiovese",
        "grenache",
        "zinfandel",
        "agiorgitiko",
        "monastrell"
    ],
    white: [
        "chardonnay",
        "sauvignon blanc",
        "riesling",
        "pinot grigio",
        "pinot gris",
        "gewurztraminer",
        "viognier",
        "albarino",
        "assyrtiko",
        "insolia",
        "bordeaux blanc"
    ],
    rose: [
        "rose",
        "rosé",
        "rosato"
    ],
    sparkling: [
        "champagne",
        "prosecco",
        "cava",
        "cremant",
        "brut",
        "sparkling"
    ]
};
const proteinWinePairings = {
    beef: {
        reds: [
            "Cabernet Sauvignon",
            "Malbec",
            "Shiraz",
            "Syrah",
            "Tempranillo"
        ],
        whites: [],
        notes: "Bold reds with firm tannins complement rich beef flavors"
    },
    lamb: {
        reds: [
            "Cabernet Sauvignon",
            "Syrah",
            "Grenache",
            "Tempranillo",
            "Malbec"
        ],
        whites: [],
        notes: "Full-bodied reds with earthy notes pair well with lamb"
    },
    pork: {
        reds: [
            "Pinot Noir",
            "Grenache",
            "Tempranillo"
        ],
        whites: [
            "Chardonnay",
            "Riesling",
            "Pinot Grigio"
        ],
        notes: "Medium-bodied wines complement pork's versatility"
    },
    poultry: {
        reds: [
            "Pinot Noir",
            "Grenache",
            "Gamay"
        ],
        whites: [
            "Chardonnay",
            "Sauvignon Blanc",
            "Riesling",
            "Pinot Grigio"
        ],
        notes: "Light to medium wines work well with poultry"
    },
    fish: {
        reds: [
            "Pinot Noir"
        ],
        whites: [
            "Sauvignon Blanc",
            "Chardonnay",
            "Pinot Grigio",
            "Albarino",
            "Riesling"
        ],
        notes: "Crisp whites and light reds complement delicate fish"
    },
    shellfish: {
        reds: [],
        whites: [
            "Sauvignon Blanc",
            "Champagne",
            "Cava",
            "Muscadet",
            "Albarino"
        ],
        notes: "Bright, acidic wines cut through shellfish richness"
    },
    veg: {
        reds: [
            "Pinot Noir",
            "Grenache"
        ],
        whites: [
            "Sauvignon Blanc",
            "Riesling",
            "Pinot Grigio",
            "Vermentino"
        ],
        notes: "Fresh, herbaceous wines complement vegetable dishes"
    },
    cheese: {
        reds: [
            "Cabernet Sauvignon",
            "Tempranillo",
            "Port"
        ],
        whites: [
            "Chardonnay",
            "Riesling",
            "Gewurztraminer"
        ],
        notes: "Match wine intensity to cheese strength"
    }
};
const flavorPairings = {
    spicy: {
        wines: [
            "Riesling",
            "Gewurztraminer",
            "Prosecco",
            "Rosé"
        ],
        avoid: [
            "Cabernet Sauvignon",
            "High-tannin reds"
        ],
        note: "Off-dry wines with lower alcohol tame spice"
    },
    creamy: {
        wines: [
            "Chardonnay",
            "Champagne",
            "Viognier"
        ],
        avoid: [
            "High-acid whites"
        ],
        note: "Rich, buttery wines complement creamy sauces"
    },
    smoky: {
        wines: [
            "Syrah",
            "Shiraz",
            "Malbec",
            "Oak-aged wines"
        ],
        avoid: [
            "Delicate whites"
        ],
        note: "Wines with smoky, earthy notes echo grilled flavors"
    },
    citrus: {
        wines: [
            "Sauvignon Blanc",
            "Albarino",
            "Vermentino",
            "Champagne"
        ],
        avoid: [
            "Heavy reds"
        ],
        note: "Bright, citrusy wines mirror citrus flavors"
    },
    herbaceous: {
        wines: [
            "Sauvignon Blanc",
            "Vermentino",
            "Grüner Veltliner"
        ],
        avoid: [
            "Oaky wines"
        ],
        note: "Herbaceous wines complement fresh herbs"
    },
    sweet: {
        wines: [
            "Riesling",
            "Moscato",
            "Late Harvest wines"
        ],
        avoid: [
            "Dry tannic reds"
        ],
        note: "Match or exceed dish sweetness"
    },
    umami: {
        wines: [
            "Pinot Noir",
            "Nebbiolo",
            "Aged wines",
            "Champagne"
        ],
        avoid: [
            "Very young wines"
        ],
        note: "Aged wines with complexity complement umami"
    }
};
const cookingMethodPairings = {
    grilled: {
        wines: [
            "Cabernet Sauvignon",
            "Malbec",
            "Syrah",
            "Zinfandel"
        ],
        note: "Bold wines match charred, smoky flavors"
    },
    roasted: {
        wines: [
            "Chardonnay",
            "Pinot Noir",
            "Merlot"
        ],
        note: "Medium-bodied wines for caramelized flavors"
    },
    fried: {
        wines: [
            "Champagne",
            "Prosecco",
            "Sauvignon Blanc"
        ],
        note: "Bubbles and acidity cut through oil"
    },
    braised: {
        wines: [
            "Pinot Noir",
            "Grenache",
            "Côtes du Rhône"
        ],
        note: "Earthy wines complement slow-cooked dishes"
    },
    raw: {
        wines: [
            "Champagne",
            "Chablis",
            "Sauvignon Blanc"
        ],
        note: "Crisp, clean wines for raw preparations"
    },
    steamed: {
        wines: [
            "Riesling",
            "Pinot Grigio",
            "Muscadet"
        ],
        note: "Light wines for delicate preparations"
    }
};
function getWineRecommendations(input, wines) {
    const candidates = new Map();
    for (const wine of wines){
        const candidate = {
            name: wine.name,
            score: 50,
            reasons: [],
            category: wine.category,
            varietal: wine.grape,
            origin: wine.origin
        };
        if (input.preferredColor && input.preferredColor !== "any") {
            const wineCategory = wine.category.toLowerCase();
            const preferredLower = input.preferredColor.toLowerCase();
            if (preferredLower === "red" && wineCategory === "red") {
                candidate.score += 15;
                candidate.reasons.push("Matches your red wine preference");
            } else if (preferredLower === "white" && wineCategory === "white") {
                candidate.score += 15;
                candidate.reasons.push("Matches your white wine preference");
            } else if (preferredLower === "rose" && wineCategory === "rosé") {
                candidate.score += 15;
                candidate.reasons.push("Matches your rosé preference");
            } else if (preferredLower === "sparkling" && wineCategory === "sparkling") {
                candidate.score += 15;
                candidate.reasons.push("Matches your sparkling preference");
            } else {
                candidate.score -= 10;
            }
        }
        if (input.protein && proteinWinePairings[input.protein]) {
            const pairing = proteinWinePairings[input.protein];
            const grapeLower = wine.grape.toLowerCase();
            const matchesRed = pairing.reds.some((r)=>grapeLower.includes(r.toLowerCase()));
            const matchesWhite = pairing.whites.some((w)=>grapeLower.includes(w.toLowerCase()));
            if (matchesRed || matchesWhite) {
                candidate.score += 20;
                candidate.reasons.push(pairing.notes);
            }
        }
        for (const flavor of input.flavorNotes){
            const flavorLower = flavor.toLowerCase();
            if (flavorPairings[flavorLower]) {
                const pairing = flavorPairings[flavorLower];
                const grapeLower = wine.grape.toLowerCase();
                if (pairing.wines.some((w)=>grapeLower.includes(w.toLowerCase()))) {
                    candidate.score += 10;
                    candidate.reasons.push(pairing.note);
                }
                if (pairing.avoid.some((a)=>grapeLower.includes(a.toLowerCase()))) {
                    candidate.score -= 15;
                }
            }
        }
        if (input.cookingMethod && cookingMethodPairings[input.cookingMethod]) {
            const pairing = cookingMethodPairings[input.cookingMethod];
            const grapeLower = wine.grape.toLowerCase();
            if (pairing.wines.some((w)=>grapeLower.includes(w.toLowerCase()))) {
                candidate.score += 10;
                candidate.reasons.push(pairing.note);
            }
        }
        if (input.heatLevel >= 3) {
            const grapeLower = wine.grape.toLowerCase();
            if (grapeLower.includes("riesling") || grapeLower.includes("gewurz")) {
                candidate.score += 15;
                candidate.reasons.push("Off-dry wines help tame spice");
            }
            if (wine.category === "Red" && !grapeLower.includes("pinot")) {
                candidate.score -= 10;
            }
        }
        if (input.sweetnessLevel >= 3) {
            const grapeLower = wine.grape.toLowerCase();
            if (grapeLower.includes("riesling") || grapeLower.includes("moscato")) {
                candidate.score += 10;
                candidate.reasons.push("Sweet wines balance sweet dishes");
            }
        }
        if (input.budget) {
            if (wine.price <= input.budget) {
                candidate.score += 5;
                candidate.reasons.push("Within your budget");
            } else if (wine.price > input.budget * 1.5) {
                candidate.score -= 10;
            }
        }
        if (candidate.reasons.length === 0) {
            candidate.reasons.push("Versatile pairing option");
        }
        candidates.set(wine.name, candidate);
    }
    return Array.from(candidates.values()).sort((a, b)=>b.score - a.score).slice(0, 10);
}
function getFoodRecommendations(input, foods) {
    const candidates = new Map();
    const wineColor = detectWineColor(input.varietal || input.wineName || "");
    const wineBody = input.body || 3;
    const wineTannin = input.tannin || 3;
    const wineAcidity = input.acidity || 3;
    for (const food of foods){
        const candidate = {
            name: food.name,
            score: 50,
            reasons: [],
            category: food.category
        };
        const foodLower = food.name.toLowerCase();
        const categoryLower = food.category.toLowerCase();
        if (wineColor === "red") {
            if (categoryLower.includes("meat") || foodLower.includes("lamb") || foodLower.includes("beef") || foodLower.includes("steak")) {
                candidate.score += 25;
                candidate.reasons.push("Red wines pair excellently with red meats");
            }
            if (wineTannin >= 4 && (foodLower.includes("lamb") || foodLower.includes("beef"))) {
                candidate.score += 10;
                candidate.reasons.push("High tannins complement rich, fatty meats");
            }
        }
        if (wineColor === "white") {
            if (foodLower.includes("fish") || foodLower.includes("sea") || foodLower.includes("shrimp") || foodLower.includes("salmon") || foodLower.includes("branzino")) {
                candidate.score += 25;
                candidate.reasons.push("White wines are classic with seafood");
            }
            if (foodLower.includes("chicken") || foodLower.includes("joojeh")) {
                candidate.score += 15;
                candidate.reasons.push("Crisp whites complement poultry");
            }
            if (categoryLower.includes("green") || categoryLower.includes("salad")) {
                candidate.score += 15;
                candidate.reasons.push("Fresh whites pair with vegetable dishes");
            }
        }
        if (wineColor === "sparkling") {
            if (categoryLower.includes("mazze") || categoryLower.includes("spread")) {
                candidate.score += 20;
                candidate.reasons.push("Bubbles are perfect with appetizers and mezze");
            }
            if (foodLower.includes("fried") || foodLower.includes("fries")) {
                candidate.score += 15;
                candidate.reasons.push("Acidity cuts through fried foods");
            }
        }
        if (wineColor === "rose") {
            candidate.score += 10;
            candidate.reasons.push("Rosé is versatile and food-friendly");
            if (categoryLower.includes("green") || categoryLower.includes("salad")) {
                candidate.score += 10;
            }
        }
        if (wineAcidity >= 4) {
            if (foodLower.includes("hummus") || foodLower.includes("labneh") || categoryLower.includes("spread")) {
                candidate.score += 10;
                candidate.reasons.push("High acidity cuts through creamy dishes");
            }
        }
        if (candidate.reasons.length === 0) {
            candidate.reasons.push("Enjoyable pairing option");
        }
        candidates.set(food.name, candidate);
    }
    return Array.from(candidates.values()).sort((a, b)=>b.score - a.score).slice(0, 10);
}
function detectWineColor(text) {
    const lower = text.toLowerCase();
    for (const [color, keywords] of Object.entries(wineColorKeywords)){
        if (keywords.some((k)=>lower.includes(k))) {
            return color;
        }
    }
    return "red";
}
function explainPairing(dish, wine, reasons) {
    const uniqueReasons = [
        ...new Set(reasons)
    ].slice(0, 3);
    return uniqueReasons.join(". ") + ".";
}
}),
"[project]/lib/evidenceEngine.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "calculateConfidence",
    ()=>calculateConfidence,
    "searchEvidence",
    ()=>searchEvidence
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/conditions.js [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const DEFAULT_DOMAINS = [
    {
        domain: "guildsomm.com",
        tier: "A",
        weight: 1.0
    },
    {
        domain: "jancisrobinson.com",
        tier: "A",
        weight: 1.0
    },
    {
        domain: "winespectator.com",
        tier: "A",
        weight: 1.0
    },
    {
        domain: "decanter.com",
        tier: "A",
        weight: 1.0
    },
    {
        domain: "wineenthusiast.com",
        tier: "B",
        weight: 0.8
    },
    {
        domain: "thewinesociety.com",
        tier: "B",
        weight: 0.8
    },
    {
        domain: "masterclass.com",
        tier: "B",
        weight: 0.8
    },
    {
        domain: "winefolly.com",
        tier: "C",
        weight: 0.6
    },
    {
        domain: "vivino.com",
        tier: "C",
        weight: 0.4
    }
];
function hashInputs(inputs) {
    return Buffer.from(JSON.stringify(inputs)).toString("base64").slice(0, 64);
}
async function getSourceDomains() {
    try {
        const domains = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sourceDomains"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sourceDomains"].enabled, true));
        return domains.length > 0 ? domains : DEFAULT_DOMAINS.map((d)=>({
                ...d,
                enabled: true
            }));
    } catch  {
        return DEFAULT_DOMAINS.map((d)=>({
                ...d,
                enabled: true
            }));
    }
}
async function searchEvidence(query, mode, inputs) {
    const inputsHash = hashInputs(inputs);
    const queryKey = query.toLowerCase().trim();
    try {
        const cached = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["evidenceCache"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["evidenceCache"].queryKey, queryKey), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["evidenceCache"].mode, mode), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["evidenceCache"].inputsHash, inputsHash), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gt"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["evidenceCache"].expiresAt, new Date()))).limit(1);
        if (cached.length > 0) {
            return {
                items: cached[0].items,
                cached: true
            };
        }
    } catch  {}
    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) {
        return {
            items: [],
            cached: false
        };
    }
    const enabledDomains = await getSourceDomains();
    const queries = [
        `best wine pairing for ${query}`,
        `${query} wine pairing sommelier`,
        `${query} food and wine match`
    ];
    const allResults = [];
    for (const searchQuery of queries){
        try {
            const response = await fetch("https://google.serper.dev/search", {
                method: "POST",
                headers: {
                    "X-API-KEY": apiKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    q: searchQuery,
                    num: 10
                })
            });
            if (!response.ok) continue;
            const data = await response.json();
            const organic = data.organic || [];
            for (const result of organic){
                const url = result.link || "";
                const domain = extractDomain(url);
                const matchedSource = enabledDomains.find((d)=>domain.includes(d.domain) || d.domain.includes(domain));
                if (matchedSource) {
                    const existing = allResults.find((r)=>r.url === url);
                    if (!existing) {
                        allResults.push({
                            title: result.title || "",
                            url,
                            domain: matchedSource.domain,
                            snippet: result.snippet || "",
                            tier: matchedSource.tier,
                            weight: matchedSource.weight
                        });
                    }
                }
            }
        } catch  {}
    }
    const uniqueResults = deduplicateResults(allResults);
    const sortedResults = uniqueResults.sort((a, b)=>b.weight - a.weight).slice(0, 6);
    if (sortedResults.length > 0) {
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["evidenceCache"]).values({
                queryKey,
                mode,
                inputsHash,
                items: sortedResults,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });
        } catch  {}
    }
    return {
        items: sortedResults,
        cached: false
    };
}
function extractDomain(url) {
    try {
        const parsed = new URL(url);
        return parsed.hostname.replace("www.", "");
    } catch  {
        return "";
    }
}
function deduplicateResults(results) {
    const seen = new Map();
    for (const result of results){
        const key = result.title.toLowerCase().slice(0, 50);
        if (!seen.has(key) || seen.get(key).weight < result.weight) {
            seen.set(key, result);
        }
    }
    return Array.from(seen.values());
}
function calculateConfidence(ruleScore, evidenceItems, matchingEvidence) {
    let baseConfidence = Math.min(ruleScore, 100);
    if (evidenceItems.length > 0) {
        const evidenceBoost = Math.min(matchingEvidence * 5, 20);
        const tierBoost = evidenceItems.filter((_, i)=>i < matchingEvidence).reduce((sum, e)=>sum + (e.tier === "A" ? 5 : e.tier === "B" ? 3 : 1), 0);
        baseConfidence += evidenceBoost + tierBoost;
    }
    return Math.min(Math.round(baseConfidence), 100);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/api/pair/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pairingRules$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pairingRules.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$evidenceEngine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/evidenceEngine.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$evidenceEngine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$evidenceEngine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
const rateLimitMap = new Map();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60000;
function checkRateLimit(ip) {
    const now = Date.now();
    const record = rateLimitMap.get(ip);
    if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, {
            count: 1,
            resetTime: now + RATE_WINDOW
        });
        return true;
    }
    if (record.count >= RATE_LIMIT) {
        return false;
    }
    record.count++;
    return true;
}
async function POST(request) {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Rate limit exceeded. Please try again later."
        }, {
            status: 429
        });
    }
    try {
        const body = await request.json();
        const { mode, inputs } = body;
        if (!mode || !inputs) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing mode or inputs"
            }, {
                status: 400
            });
        }
        const [pairingRequest] = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pairingRequests"]).values({
            mode,
            inputs: inputs
        }).returning();
        let results;
        let evidence;
        let confidence;
        if (mode === "dish") {
            const dishInput = inputs;
            const allWines = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wines"]);
            const candidates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pairingRules$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getWineRecommendations"])(dishInput, allWines);
            const searchQuery = dishInput.dishName + (dishInput.protein ? ` ${dishInput.protein}` : "");
            evidence = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$evidenceEngine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["searchEvidence"])(searchQuery, "dish", inputs);
            const boostedCandidates = candidates.map((candidate)=>{
                let boost = 0;
                for (const item of evidence.items){
                    const snippetLower = item.snippet.toLowerCase();
                    const nameLower = candidate.name.toLowerCase();
                    const varietalLower = (candidate.varietal || "").toLowerCase();
                    if (snippetLower.includes(nameLower) || snippetLower.includes(varietalLower)) {
                        boost += item.weight * 10;
                    }
                }
                return {
                    ...candidate,
                    score: candidate.score + boost
                };
            });
            boostedCandidates.sort((a, b)=>b.score - a.score);
            results = boostedCandidates.slice(0, 3);
            const matchingEvidence = results.reduce((count, r)=>{
                return count + evidence.items.filter((e)=>e.snippet.toLowerCase().includes((r.varietal || "").toLowerCase())).length;
            }, 0);
            confidence = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$evidenceEngine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calculateConfidence"])(results[0]?.score || 50, evidence.items, matchingEvidence);
        } else {
            const wineInput = inputs;
            const allFoods = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["foods"]);
            const candidates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pairingRules$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getFoodRecommendations"])(wineInput, allFoods);
            const searchQuery = wineInput.wineName || wineInput.varietal || "wine";
            evidence = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$evidenceEngine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["searchEvidence"])(searchQuery, "wine", inputs);
            const boostedCandidates = candidates.map((candidate)=>{
                let boost = 0;
                for (const item of evidence.items){
                    const snippetLower = item.snippet.toLowerCase();
                    const nameLower = candidate.name.toLowerCase();
                    if (snippetLower.includes(nameLower)) {
                        boost += item.weight * 10;
                    }
                }
                return {
                    ...candidate,
                    score: candidate.score + boost
                };
            });
            boostedCandidates.sort((a, b)=>b.score - a.score);
            results = boostedCandidates.slice(0, 3);
            const matchingEvidence = results.reduce((count, r)=>{
                return count + evidence.items.filter((e)=>e.snippet.toLowerCase().includes(r.name.toLowerCase())).length;
            }, 0);
            confidence = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$evidenceEngine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calculateConfidence"])(results[0]?.score || 50, evidence.items, matchingEvidence);
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pairingResults"]).values({
            requestId: pairingRequest.id,
            results: {
                pairings: results,
                evidence: evidence.items,
                evidenceCached: evidence.cached
            },
            confidence
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            requestId: pairingRequest.id,
            results,
            evidence: evidence.items,
            confidence,
            mode
        });
    } catch (error) {
        console.error("Pairing error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to generate pairings"
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2b993642._.js.map