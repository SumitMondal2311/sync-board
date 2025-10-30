import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB, disconnectDB } from "./configs/db-lifecycle.js";
import { env } from "./configs/env.js";
import { authRouter } from "./domains/auth/auth.route.js";
import { APIError } from "./helpers/api-error.js";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true }));
app.use(helmet());
app.use(morgan("dev"));

app.use((err: Error, _req: Request, _res: Response, next: NextFunction) => {
    if ("body" in err) {
        throw new APIError(400, {
            message: "Request body must be valid JSON object",
            code: "invalid_json_body",
        });
    }

    next();
});

// api endpoints
app.use("/api/v1/auth", authRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof APIError) {
        console.info(err.message);
        return res.status(err.statusCode).json({
            ...err.toJSON(),
        });
    }

    console.info(err);
    res.status(500).json({
        message: "Internal server error: something went wrong",
    });
});

try {
    await connectDB();
    const server = app.listen(env.PORT, () => {
        console.info(`✅ Server is ready on port: ${env.PORT}`);
    });

    let shuttingDown = false;

    ["SIGINT", "SIGTERM"].forEach((signal) =>
        process.on(signal, () => {
            if (shuttingDown) return;
            shuttingDown = true;

            console.info(`⚠️  Received ${signal}, shutting down server...`);
            server.close(
                () =>
                    void (async () => {
                        console.info("✅ Server closed gracefully");
                        await disconnectDB();
                        process.exit(0);
                    })()
            );
        })
    );
} catch (error) {
    console.info("❎ Failed to initialize the http server", error);
    process.exit(1);
}

process.on("uncaughtException", (error: Error) => {
    console.info(`❎ Uncaught Exception ${error.stack}`);
    process.exit(1);
});

process.on("unhandledRejection", (error: Error) => {
    console.info(`❎ Unhandled Rejected ${error.stack}`);
    process.exit(1);
});
