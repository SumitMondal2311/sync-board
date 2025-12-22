import { Workspace } from "@/types/workspace";
import { create } from "zustand";

export const workspaceStore = create<{
    activeWorkspace: Workspace | null;
    setActiveWorkspace: (ws: Workspace | null) => void;
}>((set) => ({
    activeWorkspace: null,
    setActiveWorkspace: (ws) => set({ activeWorkspace: ws }),
}));
