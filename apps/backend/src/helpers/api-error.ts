export class APIError extends Error {
    code: string;
    statusCode: number;

    constructor(
        statusCode: number,
        {
            message,
            code,
        }: {
            code: string;
            message: string;
        }
    ) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            code: this.code,
            message: this.message,
        };
    }
}
