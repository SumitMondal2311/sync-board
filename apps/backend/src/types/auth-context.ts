import { Session, User, Workspace, WorkspaceMemberRole } from "@repo/database";

export type AuthContext = {
    session: Omit<Session, "userId">;
    user: Omit<User, "passwordHash">;
    workspaces: (Workspace & {
        role: WorkspaceMemberRole;
    })[];
};
