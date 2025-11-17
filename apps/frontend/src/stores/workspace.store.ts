import { Workspace } from "@/types/workspace";
import { create } from "zustand";

export const workspaceStore = create<{
    activeWorkspace: Workspace | undefined;
    setActiveWorkspace: (workspace: Workspace | undefined) => void;
}>((set) => ({
    activeWorkspace: undefined,
    setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
}));
