import { Session, User } from "@repo/database";

export type AuthContext = {
    session: Omit<Session, "userId"> & {
        user: Omit<User, "passwordHash">;
    };
};
