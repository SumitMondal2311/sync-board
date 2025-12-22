import {
    createBoardSchema,
    createListSchema,
    createTaskSchema,
    createWorkspaceSchema,
    signInSchema,
    signUpSchema,
    verifyEmailSchema,
} from "@repo/validation";
import { z } from "zod";

export type SignUpSchema = z.infer<typeof signUpSchema>;
export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
export type CreateBoardSchema = z.infer<typeof createBoardSchema>;
export type CreateListSchema = z.infer<typeof createListSchema>;
export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;
