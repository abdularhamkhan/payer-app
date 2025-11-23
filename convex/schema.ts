// import { defineSchema, defineTable } from "convex/server";
// import { v } from "convex/values";


// export default defineSchema({
//         users: defineTable({
//                 clerkUserId: v.string(),
//                 phone: v.string(),
//                 normalizedPhone: v.string(),
//                 fullName: v.string(),
//                 email: v.optional(v.string()),
//                 avatar: v.optional(v.string()),
//                 isVerified: v.boolean(),
//                 createdAt: v.number(),
//         })
//         .index("by_clerkUserId", ["clerkUserId"])
//         .index("by_phone", ["phone"])
//         .index("by_normalizedPhone", ["normalizedPhone"]),


//         user_settings: defineTable({

//         })

// })

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
        /* ---------------------------------------------
         * USERS
         * ------------------------------------------- */
        users: defineTable({
                clerkUserId: v.string(),          // Clerk identity
                phone: v.string(),                // 03xx-xxxxxxx
                normalizedPhone: v.string(),      // 923xxxxxxxxx
                fullName: v.string(),
                email: v.optional(v.string()),
                avatar: v.optional(v.string()),   // Convex storage URL
                isVerified: v.boolean(),
                createdAt: v.number(),
        })
                .index("by_clerkUserId", ["clerkUserId"])
                .index("by_phone", ["phone"])
                .index("by_normalizedPhone", ["normalizedPhone"]),

        /* ---------------------------------------------
         * USER SETTINGS (theme, notifications, etc.)
         * ------------------------------------------- */
        user_settings: defineTable({
                userId: v.id("users"),
                darkMode: v.boolean(),
                language: v.string(),
                pushNotifications: v.boolean(),
        }).index("by_user", ["userId"]),

        /* ---------------------------------------------
         * WALLET (1 user = 1 wallet)
         * ------------------------------------------- */
        wallets: defineTable({
                userId: v.id("users"),
                iban: v.string(),                 // PKR IBAN or internal account format
                balance: v.number(),              // managed via atomic mutation
                currency: v.string(),             // usually "PKR"
                createdAt: v.number(),
                updatedAt: v.number(),
        }).index("by_user", ["userId"]),

        /* ---------------------------------------------
         * CARDS (1 user = 1 card, independent from wallet)
         * ------------------------------------------- */
        cards: defineTable({
                userId: v.id("users"),
                provider: v.string(),             // Visa, Mastercard, internal
                cardLast4: v.string(),            // UI only
                expiry: v.string(),               // MM/YY
                cvcHash: v.string(),              // NEVER store raw CVC
                pinHash: v.string(),              // 4-digit PIN (bcrypt)
                frozen: v.boolean(),
                cardNumber: v.string(),
                createdAt: v.number(),
        }).index("by_user", ["userId"]),

        /* ---------------------------------------------
         * CATEGORIES (global, universal)
         * ------------------------------------------- */
        categories: defineTable({
                name: v.string(),                 // e.g. "Food", "Salary"
                type: v.string(),                 // "expense" | "income"
                icon: v.string(),
                color: v.string(),
        }),

        /* ---------------------------------------------
         * TRANSACTIONS
         * ------------------------------------------- */
        transactions: defineTable({
                userId: v.id("users"),
                walletId: v.id("wallets"),
                amount: v.number(),               // positive for income, negative for expense
                type: v.string(),                 // "DEBIT" | "CREDIT"
                description: v.optional(v.string()),
                categoryId: v.optional(v.id("categories")),
                method: v.string(),
                // peer-to-peer transfers
                toUserId: v.optional(v.id("users")),
                fromUserId: v.optional(v.id("users")),

                status: v.string(),               // "PENDING" | "SUCCESS" | "FAILED"
                createdAt: v.number(),
        })
                .index("by_wallet", ["walletId", "_creationTime"])
                .index("by_user", ["userId", "_creationTime"]),

        /* ---------------------------------------------
         * TRANSACTION REQUESTS (P2P "request money")
         * ------------------------------------------- */
        requests: defineTable({
                fromUserId: v.id("users"),
                toUserId: v.id("users"),
                amount: v.number(),
                status: v.string(), // "PENDING" | "APPROVED" | "REJECTED"
                createdAt: v.number(),
                note: v.optional(v.string()),
                rejectedReason: v.optional(v.string()),
        })
                .index("by_to_user", ["toUserId"])
                .index("by_from_user", ["fromUserId"]),

        /* ---------------------------------------------
         * QR CODES (dynamic or static)
         * ------------------------------------------- */
        qr_codes: defineTable({
                userId: v.id("users"),
                walletId: v.id("wallets"),
                token: v.string(),
                amount: v.optional(v.number()), //null = open payment qr
                expiresAt: v.number(),
                createdAt: v.number(),
        }).index("by_token", ["token"]).index("by_user", ["userId"]),


        /* ---------------------------------------------
         * NOTIFICATIONS
         * ------------------------------------------- */
        notifications: defineTable({
                userId: v.id("users"),
                title: v.string(),
                message: v.string(),
                read: v.boolean(),
                createdAt: v.number(),
        }).index("by_user", ["userId"]),

        /* ---------------------------------------------
         * AUDIT LOGS (security-grade)
         * ------------------------------------------- */
        audit_logs: defineTable({
                userId: v.id("users"),
                action: v.string(),               // "login", "transfer", "qr_scan"
                payload: v.any(),                 // store metadata
                createdAt: v.number(),
        }).index("by_user", ["userId"]),
});

