import { NextFunction, Request, Response } from "express";

import { APIError } from "../helpers/api-error.js";

export const requireBodyMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
    const contentType = req.headers["content-type"];
    if (!contentType) {
        throw new APIError(400, {
            code: "missing_header",
            message: "Request must include 'Content-Type' header.",
        });
    }

    if (!contentType.includes("application/json")) {
        throw new APIError(415, {
            code: "unsupported_header_type",
            message: "'Content-Type' header must contain 'application/json'.",
        });
    }

    if (typeof req.body !== "object" || req.body === null || Array.isArray(req.body)) {
        throw new APIError(400, {
            code: "invalid_request_body",
            message: "Request body must be a valid request object.",
        });
    }

    if (Object.keys(req.body).length === 0) {
        throw new APIError(400, {
            code: "empty_request_body",
            message: "Request body must be filled with required object.",
        });
    }

    next();
};
