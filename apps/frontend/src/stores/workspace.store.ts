import { GetAllBoardsAPISuccessResponse, WorkspaceAPIContext } from "@repo/types";
import { create } from "zustand";

export const workspaceStore = create<{
    activeWorkspace: WorkspaceAPIContext | null;
    setActiveWorkspace: (workspace: WorkspaceAPIContext | null) => void;
    boards: GetAllBoardsAPISuccessResponse;
    setBoards: (boards: GetAllBoardsAPISuccessResponse) => void;
}>((set) => ({
    activeWorkspace: null,
    setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
    boards: [],
    setBoards: (boards) => set({ boards }),
}));
