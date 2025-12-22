import { Session, User, Workspace, WorkspaceMembership } from "@repo/database";

export type RequireAuthContext = Omit<Session, "userId"> & {
    user: Omit<User, "passwordHash"> & {
        workspaces: Array<
            Workspace & {
                membership: Pick<WorkspaceMembership, "role" | "createdAt">;
            }
        >;
    };
};
