import {
    authSchema,
    emailAddressSchema,
    passwordSchema,
    verificationCodeSchema,
} from "@repo/validation";
import { z } from "zod";

export type EmailAddressSchema = z.infer<typeof emailAddressSchema>;
export type AuthSchema = z.infer<typeof authSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>;
export type VerificationCodeSchema = z.infer<typeof verificationCodeSchema>;
