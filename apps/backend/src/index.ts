import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB, disconnectDB } from "./configs/db-lifecycle.js";
import { env } from "./configs/env.js";
import { errorHandlerMiddleware } from "./middlewares/error-handle.js";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true }));
app.use(helmet());
app.use(morgan("dev"));

app.use(errorHandlerMiddleware);

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

            console.info(`⚠️ Received ${signal}, shutting down server...`);
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
    console.error("❎ Failed to initialize the http server", error);
    process.exit(1);
}

process.on("uncaughtException", (error: Error) => {
    console.error(`❎ Uncaught Exception ${error.stack}`);
    process.exit(1);
});

process.on("unhandledRejection", (error: Error) => {
    console.error(`❎ Unhandled Rejected ${error.stack}`);
    process.exit(1);
});
