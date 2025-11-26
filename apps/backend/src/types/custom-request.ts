import {
    SessionAPIContext,
    UserAPIContext,
    WorkspaceAPIContext,
    WorkspacePolicy,
} from "@repo/types";
import { Request } from "express";

export type RequireAuthRequest = Request & {
    session: SessionAPIContext & {
        user: UserAPIContext & {
            workspaces: WorkspaceAPIContext[];
        };
    };
};

export type RequireWorkspaceRequest = Request & {
    activeWorkspaceId: string;
    workspacePolicy: WorkspacePolicy;
};
