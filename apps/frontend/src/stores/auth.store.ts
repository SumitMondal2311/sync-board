import { GetSessionAPISuccessResponse, WorkspaceAPIContext } from "@repo/types";
import { create } from "zustand";

export const authStore = create<{
    activeWorkspace: WorkspaceAPIContext | null;
    setActiveWorkspace: (workspace: WorkspaceAPIContext | null) => void;
    session: GetSessionAPISuccessResponse | null;
    setSession: (session: GetSessionAPISuccessResponse | null) => void;
}>((set) => ({
    activeWorkspace: null,
    setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
    session: null,
    setSession: (session) => set({ session }),
}));
