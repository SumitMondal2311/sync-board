import { config } from "dotenv";
import path from "path";
import { defineConfig, env } from "prisma/config";

config({ path: path.join(import.meta.dirname, "../..", "apps/backend/.env") });

export default defineConfig({
    datasource: {
        url: env("DATABASE_URL"),
    },
});
