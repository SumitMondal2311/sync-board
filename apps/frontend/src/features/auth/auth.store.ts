import { SessionAPIContext } from "@repo/types";
import { create } from "zustand";

export const useAuthStore = create<{
    session: SessionAPIContext | null;
    setSession: (session: SessionAPIContext) => void;
}>((set) => ({
    session: null,
    setSession: (session) => set({ session }),
}));
