import { randomBytes } from "crypto";

export const generateToken = (byteSize = 32) => {
    return randomBytes(byteSize).toString("hex");
};
