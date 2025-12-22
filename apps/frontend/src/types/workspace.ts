import { GetSessionResponse } from "@repo/types";

export type Workspace = GetSessionResponse["user"]["workspaces"][number];
