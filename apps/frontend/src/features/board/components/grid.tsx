"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { useBoards } from "@/features/board/hooks/use-boards";
import { boardStore } from "@/stores/board.store";
import { CreateBoardButton } from "./create-button";

export const BoardsGrid = () => {
    const { data: boards, isSuccess } = useBoards();
    const { setBoards } = boardStore();
    const subscribedBoards = boardStore((st) => st.boards);
    const router = useRouter();

    React.useEffect(() => {
        if (isSuccess) {
            setBoards(boards.data);
        }
    }, [isSuccess, setBoards, boards]);

    if (!boards) {
        return null;
    }

    return (
        <div className="grid flex-1 auto-rows-min grid-cols-1 gap-4 overflow-y-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {subscribedBoards?.map((board) => (
                <div
                    key={board.id}
                    className="hover:ring-ring grid aspect-video cursor-pointer place-items-center rounded-md border p-2 text-sm transition-shadow hover:ring hover:ring-inset"
                    onClick={() => router.push(`/dashboard/boards/${board.id}`)}
                >
                    {board.title}
                </div>
            ))}
            <CreateBoardButton />
            <div className="h-500"></div>
        </div>
    );
};
