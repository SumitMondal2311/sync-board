import { Session, User, Workspace, WorkspaceMemberRole, WorkspaceMembership } from "@repo/database";
import {
    authSchema,
    emailSchema,
    passwordSchema,
    titleSchema,
    verificationCodeSchema,
} from "@repo/validation";
import { z } from "zod";

export type AuthSchema = z.infer<typeof authSchema>;
export type EmailSchema = z.infer<typeof emailSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>;
export type TitleSchema = z.infer<typeof titleSchema>;
export type VerificationCodeSchema = z.infer<typeof verificationCodeSchema>;

export const permissions: Record<WorkspaceMemberRole, Array<string>> = {
    ADMIN: [
        "workspace:manage",
        "workspace:read",
        "workspace:memberships:manage",
        "workspace:memberships:read",
        "workspace:delete",
        "workspace:boards:create",
        "workspace:boards:manage",
        "workspace:boards:read",
        "workspace:boards:delete",
        "workspace:lists:create",
        "workspace:lists:manage",
        "workspace:lists:read",
        "workspace:lists:delete",
        "workspace:tasks:create",
        "workspace:tasks:manage",
        "workspace:tasks:read",
        "workspace:tasks:assign",
        "workspace:tasks:delete",
        "workspace:billing:manage",
        "workspace:billing:read",
        "workspace:activities:read",
    ],
    MEMBER: [
        "workspace:read",
        "workspace:memberships:read",
        "workspace:boards:create",
        "workspace:boards:manage",
        "workspace:boards:read",
        "workspace:lists:create",
        "workspace:lists:read",
        "workspace:lists:manage",
        "workspace:tasks:create",
        "workspace:tasks:read",
        "workspace:tasks:manage",
        "workspace:tasks:assign",
        "workspace:billing:read",
        "workspace:activities:read",
    ],
    GUEST: [
        "workspace:read",
        "workspace:memberships:read",
        "workspace:boards:read",
        "workspace:lists:read",
        "workspace:tasks:read",
        "workspace:activities:read",
    ],
};

export type SessionAPIContext = Omit<Session, "userId"> & {
    user: Omit<User, "passwordHash"> & {
        workspaces: (Workspace & {
            membership: Pick<WorkspaceMembership, "role" | "createdAt">;
        })[];
    };
};
