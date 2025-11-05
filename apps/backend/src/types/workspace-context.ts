import { Workspace, WorkspaceMembership } from "@repo/database";

export type WorkspaceContext = {
    workspace: Workspace & {
        membership: Pick<WorkspaceMembership, "role" | "createdAt">;
    };
};
