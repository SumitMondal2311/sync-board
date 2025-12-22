import { Board, Comment, List, Session, Task, User } from "@repo/database";

import { RequireAuthContext } from "./middleware-contexts.js";

// ----- Auth ----- //
export type PrepareVerifyEmailResponse = {
    maskedEmail: string;
};

// ----- Session ----- //
export type GetSessionResponse = RequireAuthContext;
export type GetActiveSessionsResponse = Array<
    Pick<Session, "id" | "ipAddress" | "userAgent" | "lastActiveAt">
>;

// ----- Board ----- //
export type CreateBoardResponse = Pick<Board, "id" | "creatorId" | "title">;
export type GetBoardsResponse = Array<Pick<Board, "id" | "creatorId" | "title">>;

// ----- List ----- //
export type CreateListResponse = Pick<List, "id" | "position" | "title">;
export type GetListsResponse = Array<
    Pick<List, "id" | "position" | "title"> & {
        tasks: Array<
            Pick<Task, "id" | "position" | "title" | "dueDate"> & {
                commentsCount: number;
                assignee: Pick<User, "id" | "firstName" | "lastName" | "email"> | null;
            }
        >;
    }
>;

// ----- Task ----- //
export type GetTaskResponse = Array<
    Pick<Task, "id" | "position" | "title" | "dueDate"> & {
        assignee: Pick<User, "id" | "firstName" | "lastName" | "email"> | null;
        comments: Array<Pick<Comment, "id" | "text" | "userId" | "createdAt">>;
    }
>;
