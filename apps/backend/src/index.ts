import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
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

const server = app.listen(env.PORT, () => {
    console.info(`✅ Server is ready on port: ${env.PORT}`);
});

let shuttingDown = false;

["SIGINT", "SIGTERM"].forEach((signal) =>
    process.on(signal, () => {
        if (shuttingDown) return;
        shuttingDown = true;

        console.info(`❗️ Received ${signal}, shutting down server...`);
        server.close(() => {
            console.info("✅ Server closed gracefully");
            process.exit(0);
        });
    })
);

process.on("uncaughtException", (error: Error) => {
    console.error(`❎ Uncaught Exception ${error}`);
    process.exit(1);
});

process.on("unhandledRejection", (error: Error) => {
    console.error(`❎ Unhandled Rejected ${error}`);
    process.exit(1);
});
