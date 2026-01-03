// ----- Request Body Schemas ----- //

import {
    changePasswordSchema,
    createBoardSchema,
    createListSchema,
    createTaskSchema,
    createWorkspaceSchema,
    resetPasswordSchema,
    signInSchema,
    signUpSchema,
    verifyEmailSchema,
} from "@repo/validation";

import { z } from "zod";

export type SignUpSchema = z.infer<typeof signUpSchema>;
export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type CreateBoardSchema = z.infer<typeof createBoardSchema>;
export type CreateListSchema = z.infer<typeof createListSchema>;
export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

// ----- Responses ----- //

import {
    Board,
    Comment,
    List,
    Session,
    Task,
    User,
    Workspace,
    WorkspaceMembership,
} from "@repo/database";

export type PrepareVerifyEmailResponse = {
    maskedEmail: string;
};

export type GetSessionResponse = Omit<Session, "userId"> & {
    user: Omit<User, "passwordHash"> & {
        workspaces: Array<
            Workspace & {
                membership: Pick<WorkspaceMembership, "role" | "createdAt">;
            }
        >;
    };
};

export type GetActiveSessionsResponse = Array<
    Pick<Session, "id" | "ipAddress" | "userAgent" | "lastActiveAt">
>;

export type CreateBoardResponse = Pick<Board, "id" | "creatorId" | "title">;
export type GetBoardsResponse = Array<Pick<Board, "id" | "creatorId" | "title">>;

export type CreateListResponse = Pick<List, "id" | "position" | "title">;
export type GetListsResponse = Array<
    Pick<List, "id" | "position" | "title"> & {
        tasks: Array<
            Pick<Task, "id" | "position" | "title" | "dueDate"> & {
                commentsCount: number;
                assignee: Pick<User, "id" | "firstName" | "lastName" | "email"> | null;
            }
        >;
    }
>;

export type CreateTaskResponse = Pick<Task, "id" | "position" | "title" | "dueDate"> & {
    assignee: Pick<User, "id" | "firstName" | "lastName" | "email"> | null;
};

export type GetTasksResponse = Array<
    Pick<Task, "id" | "position" | "title" | "dueDate"> & {
        assignee: Pick<User, "id" | "firstName" | "lastName" | "email"> | null;
        comments: Array<Pick<Comment, "id" | "text" | "userId" | "createdAt">>;
    }
>;

export type CreateWorkspaceResponse = GetSessionResponse["user"]["workspaces"][number];
