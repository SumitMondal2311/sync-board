import { NextFunction, Request, Response } from "express";
import { APIError } from "../helpers/api-error.js";

export const requireBodyMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
    const contentType = req.headers["content-type"];
    if (!contentType) {
        throw new APIError(400, {
            message: "Missing 'Content-Type' header.",
            code: "missing_header",
        });
    }

    if (contentType !== "application/json") {
        throw new APIError(400, {
            message: "Invalid 'Content-Type' header. Expected 'application/json'",
            code: "invalid_request_header",
        });
    }

    if (typeof req.body !== "object" || Array.isArray(req.body)) {
        throw new APIError(400, {
            message: "Request body must be a valid JSON object.",
            code: "invalid_request_body",
        });
    }

    if (Object.keys(req.body).length <= 0) {
        throw new APIError(400, {
            message: "Request body cannot be unfilled.",
            code: "unfilled_request_body",
        });
    }

    next();
};
