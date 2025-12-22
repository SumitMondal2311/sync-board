import z from "zod";

const emailSchema = z.object({
    email: z.email("Invalid email"),
});

const passwordSchema = z.object({
    password: z
        .string({ error: "Password is required" })
        .nonempty("Enter password")
        .min(8, "Password must contain at least 8 characters")
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[A-Z]/, "Password must contain a uppercase letter")
        .regex(/[0-9]/, "Password must contain a digit")
        .regex(/[^a-z0-9A-Z]/, "Password must contain a special character"),
});

export const signUpSchema = z.object({
    firstName: z
        .string({ error: "First name is required" })
        .nonempty("Enter first name")
        .min(2, "First name must contain at least 2 characters")
        .max(32, "First name must contain at most 32 characters"),
    lastName: z
        .string()
        .min(2, "Last name must contain at least 2 characters")
        .max(32, "Last name must contain at most 32 characters")
        .optional(),
    ...emailSchema.shape,
    ...passwordSchema.shape,
});

export const signInSchema = z.object({
    ...emailSchema.shape,
    ...passwordSchema.shape,
});

export const verifyEmailSchema = z.object({
    code: z.string({ error: "Verification code is required" }).nonempty("Enter verification code"),
});

export const createBoardSchema = z.object({
    title: z.string({ error: "Board title is required" }).nonempty("Enter board's title"),
});

export const createListSchema = z.object({
    title: z.string({ error: "List title is required" }).nonempty("Enter list's title"),
});

export const createTaskSchema = z.object({
    title: z.string({ error: "Task title is required" }).nonempty("Enter task's title"),
    dueDate: z.coerce.date({ error: "Invalid date" }).optional(),
    assigneeId: z.uuid("Invalid assignee Id").optional(),
});

export const createWorkspaceSchema = z.object({
    name: z.string({ error: "Workspace name is required" }).nonempty("Enter workspace name"),
});
