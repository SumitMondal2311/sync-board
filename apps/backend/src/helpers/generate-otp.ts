import { hash } from "argon2";
import { randomInt } from "crypto";

export const generateOtp = (length: number) => {
    const otp = Array.from({ length }, () => randomInt(0, 10)).join("");
    return {
        rawOtp: otp,
        hashedOtp: hash(otp),
    };
};
