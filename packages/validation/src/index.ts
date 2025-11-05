import z from "zod";

export const emailAddressSchema = z.object({
    emailAddress: z.string().nonempty("Enter email address").email("Enter a valid email address"),
});

export const passwordSchema = z.object({
    password: z
        .string()
        .nonempty("Enter password")
        .min(12, "Password must contain at least 12 characters"),
});

export const authSchema = z.object({
    ...passwordSchema.shape,
    ...emailAddressSchema.shape,
});

export const verificationCodeSchema = z.object({
    code: z.string().nonempty("Enter code"),
});

export const titleSchema = z.object({
    title: z.string().nonempty("Enter title"),
});
