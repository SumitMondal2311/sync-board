import { prisma } from "@repo/database";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { setTimeout } from "timers/promises";

import { MAX_DB_RECONNECTION_ATTEMPTS } from "@/configs/constants";
import { env } from "@/configs/env";
import { authRouter } from "@/domains/auth/auth.route";
import { boardRouter } from "@/domains/board/board.route";
import { listRouter } from "@/domains/list/list.route";
import { meRouter } from "@/domains/me/me.route";
import { sessionRouter } from "@/domains/session/session.route";
import { taskRouter } from "@/domains/task/task.route";
import { APIError } from "@/helpers/api-error";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(morgan("dev"));

app.use((err: Error, _req: Request, _res: Response, next: NextFunction) => {
    if ("body" in err) {
        throw new APIError(400, {
            code: "invalid_json_body",
            message: "Request body must be valid JSON object.",
        });
    }

    next();
});

// API endpoints
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/me/sessions", sessionRouter);
app.use("/api/v1/me", meRouter);
app.use("/api/v1/me/boards", boardRouter);
app.use("/api/v1/me/lists", listRouter);
app.use("/api/v1/me/tasks", taskRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof APIError) {
        console.log(err.message);
        return res.status(err.statusCode).json({
            ...err.toJSON(),
        });
    }

    console.log(err);
    res.status(500).json({
        message: "Internal server error: something went wrong",
    });
});

try {
    void (async () => {
        try {
            await prisma.$connect();
            console.log("✅ Connected to the DB successfully");
        } catch (error) {
            console.warn("❗️ Failed to connect the DB", error);
            for (let attempt = 1; attempt <= MAX_DB_RECONNECTION_ATTEMPTS; attempt++) {
                try {
                    await prisma.$connect();
                    console.log("✅ Reconnected to DB");
                    return;
                } catch (error) {
                    console.error(`❗️ Failed reconnecting to DB on attempt ${attempt}`, error);
                    if (attempt < MAX_DB_RECONNECTION_ATTEMPTS) {
                        const wait = 2 ** attempt * 1000;
                        console.log(`🔁 Retrying in ${wait / 1000}s...`);
                        await setTimeout(wait);
                    }
                }
            }

            console.error("❎ Failed to connect DB after multiple retries");
            process.exit(1);
        }
    })();

    const server = app.listen(env.PORT, () => {
        console.log(`✅ Server is ready on port: ${env.PORT}`);
    });

    let shuttingDown = false;

    ["SIGINT", "SIGTERM"].forEach((signal) =>
        process.on(signal, () => {
            if (shuttingDown) return;
            shuttingDown = true;

            console.warn(`❗️ Received ${signal}, shutting down server...`);
            server.close(
                void (async () => {
                    console.log("✅ Server closed gracefully");
                    try {
                        await prisma.$disconnect();
                        console.log("✅ Databse disconnected successfully");
                    } catch (_) {
                        console.warn("❗️ Failed to disconnect DB");
                    }
                    process.exit(0);
                })()
            );
        })
    );
} catch (error) {
    console.log("❎ Failed to initialize the http server", error);
    process.exit(1);
}

process.on("uncaughtException", (error: Error) => {
    console.log(`❎ Uncaught Exception ${error.stack}`);
    process.exit(1);
});

process.on("unhandledRejection", (error: Error) => {
    console.log(`❎ Unhandled Rejected ${error.stack}`);
    process.exit(1);
});
