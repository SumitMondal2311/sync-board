import { NextFunction, Request, Response } from "express";
import { APIError } from "../helpers/api-error.js";

export const errorHandlerMiddleware = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof APIError) {
        console.error(err.message);
        return res.status(err.statusCode).json({
            ...err.toJSON(),
        });
    }

    console.error(err);
    res.status(500).json({
        message: "Internal server error: something went wrong",
    });
};
