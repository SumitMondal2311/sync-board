import { RequireAuthContext, WorkspacePolicy } from "@repo/types";
import { Request } from "express";

export type RequireAuthRequest = Request & {
    session: RequireAuthContext;
};

export type RequireWorkspaceRequest = Request & {
    activeWorkspaceId: string;
    workspacePolicy: WorkspacePolicy;
};
