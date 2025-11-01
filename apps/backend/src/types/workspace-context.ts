import { Workspace, WorkspaceMembership } from "@repo/database";

export type WorkspaceContext = {
    workspace: Omit<Workspace, "userId"> & {
        membership: Pick<WorkspaceMembership, "role" | "createdAt">;
    };
};
