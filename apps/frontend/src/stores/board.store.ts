import { GetBoardsResponse } from "@repo/types";
import { create } from "zustand";

export const boardStore = create<{
    boards: GetBoardsResponse;
    setBoards: (bords: GetBoardsResponse) => void;
}>((set) => ({
    boards: [],
    setBoards: (boards) => set({ boards }),
}));
