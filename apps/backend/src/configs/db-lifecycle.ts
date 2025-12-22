import { setTimeout } from "timers/promises";

import { prisma } from "@repo/database";
import { MAX_DB_RECONNECTION_ATTEMPTS } from "./constants.js";

export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.info("✅ Database connected successfully");
    } catch (error) {
        console.info("⚠️  Failed to connect database\n", error);
        for (let attempt = 1; attempt <= MAX_DB_RECONNECTION_ATTEMPTS; attempt++) {
            try {
                await prisma.$connect();
                console.info("✅ Reconnected to database successfully");
                return;
            } catch (error) {
                console.info(`⚠️  Failed reconnecting to database on attempt ${attempt}\n`, error);
                if (attempt < MAX_DB_RECONNECTION_ATTEMPTS) {
                    const wait = 2 ** attempt * 1000;
                    console.info(`🔁 Retrying in ${wait / 1000}s...`);
                    await setTimeout(wait);
                }
            }
        }

        console.info("❎ Failed to connect database after multiple tries");
        process.exit(1);
    }
};

export const disconnectDB = async () => {
    try {
        await prisma.$disconnect();
        console.info("✅ Databse disconnected successfully");
    } catch (_) {
        console.info("⚠️  Failed to disconnect database");
        process.exit(1);
    }
};
