import { UserAPIContext } from "@repo/types";
import { create } from "zustand";

export const useAuthStore = create<{
    user: UserAPIContext | null;
    setUser: (user: UserAPIContext) => void;
}>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));
