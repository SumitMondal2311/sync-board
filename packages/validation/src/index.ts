import z from "zod";

export const emailSchema = z.object({
    email: z.string().email("Enter a valid email address"),
});

export const passwordSchema = z.object({
    password: z.string().min(12, "Password must contain at least 12 characters"),
});

export const authSchema = z.object({
    ...emailSchema.shape,
    ...passwordSchema.shape,
});

export const verificationCodeSchema = z.object({
    code: z.string().nonempty("Code required"),
});

export const titleSchema = z.object({
    title: z.string().nonempty("Title required"),
});
