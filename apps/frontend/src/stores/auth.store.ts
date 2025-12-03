import { create } from "zustand";

import { GetSessionAPISuccessResponse } from "@repo/types";
import { workspaceStore } from "./workspace.store";

export const authStore = create<{
    session: GetSessionAPISuccessResponse | null;
    setSession: (session: GetSessionAPISuccessResponse | null) => void;
    onSignOut: () => void;
}>((set) => ({
    session: null,
    setSession: (session) => set({ session }),
    onSignOut: () => {
        workspaceStore.setState({ activeWorkspace: null, boards: [] });
        set({ session: null });
    },
}));
