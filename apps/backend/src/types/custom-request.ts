import { GetSessionResponse, WorkspacePolicy } from "@repo/types";
import { Request } from "express";

export type RequireAuthRequest = Request & {
    session: GetSessionResponse;
};

export type RequireWorkspaceRequest = Request & {
    activeWorkspaceId: string;
    workspacePolicy: WorkspacePolicy;
};
