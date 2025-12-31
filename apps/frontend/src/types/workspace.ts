import { GetSessionResponse } from "@repo/types/api";

export type Workspace = GetSessionResponse["user"]["workspaces"][number];
