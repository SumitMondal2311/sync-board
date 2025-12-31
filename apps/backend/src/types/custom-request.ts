import { GetSessionResponse } from "@repo/types/api";
import { WorkspacePolicy } from "@repo/types/policies";
import { Request } from "express";

export type RequireAuthRequest = Request & {
    session: GetSessionResponse;
};

export type RequireWorkspaceRequest = Request & {
    activeWorkspaceId: string;
    workspacePolicy: WorkspacePolicy;
};
