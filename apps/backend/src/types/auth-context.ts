import { Session } from "@repo/database";
import { UserAPIContext, WorkspaceAPIContext } from "@repo/types";

export type AuthContext = {
    session: Omit<Session, "userId">;
    user: UserAPIContext;
    workspaces: WorkspaceAPIContext[];
};
