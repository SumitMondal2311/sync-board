import { NextFunction, Request, Response } from "express";
import { APIError } from "../helpers/api-error.js";

export const requireBodyMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
    const contentHeader = req.headers["content-type"];
    if (!contentHeader) {
        throw new APIError(400, {
            message: "Missing 'Content-Type' header",
            code: "missing_content_type",
        });
    }

    if (contentHeader !== "application/json") {
        throw new APIError(400, {
            message: "Invalid 'Content-Type' header. Expected 'application/json'",
            code: "invalid_content_type",
        });
    }

    if (typeof req.body !== "object" || Array.isArray(req.body)) {
        throw new APIError(400, {
            message: "Request body must be a valid JSON object",
            code: "invalid_json_body",
        });
    }

    if (Object.keys(req.body).length <= 0) {
        throw new APIError(400, {
            message: "Request body cannot be empty",
            code: "empty_request_body",
        });
    }

    next();
};
