"use client";

import { useQuery } from "@tanstack/react-query";
import { SquareKanban } from "lucide-react";
import { useEffect } from "react";

import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { workspaceStore } from "@/stores/workspace.store";
import { GetAllBoardsAPISuccessResponse } from "@repo/types";
import { useRouter } from "next/navigation";

export const BoardsGrid = () => {
    const activeWorkspaceId = workspaceStore((st) => st.activeWorkspace?.id);
    const boards = workspaceStore((st) => st.boards);
    const { setBoards } = workspaceStore();
    const router = useRouter();

    const { isLoading, isSuccess, data } = useQuery({
        queryKey: [activeWorkspaceId, "boards"],
        retry: 1,
        enabled: !!activeWorkspaceId,
        queryFn: () =>
            apiClient.get<{ boards: GetAllBoardsAPISuccessResponse }>("/me/boards", {
                headers: {
                    "x-workspace-id": activeWorkspaceId,
                },
            }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });

    useEffect(() => {
        if (isSuccess) {
            setBoards(data.data.boards);
        }
    }, [isSuccess, setBoards, data]);

    if (isLoading) {
        return null;
    }

    return (
        <div
            className={cn(
                "grid flex-1 overflow-y-auto",
                boards.length >= 1
                    ? "auto-rows-min grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
                    : "place-items-center"
            )}
        >
            {boards.length >= 1 ? (
                boards.map((board) => (
                    <div
                        key={board.id}
                        className="bg-accent/50 hover:ring-ring grid aspect-video cursor-pointer place-items-center rounded-md border p-2 text-sm transition-shadow hover:ring hover:ring-inset"
                        onClick={() => router.push(`/board/${board.id}`)}
                    >
                        {board.title}
                    </div>
                ))
            ) : (
                <div className="grid max-w-96 place-items-center text-center">
                    <SquareKanban className="size-8" />
                    <p className="text-2xl font-medium">No boards yet</p>
                    <p className="text-muted-foreground text">
                        You haven&apos;t created any boards yet. Get started by creating your first
                        board.
                    </p>
                </div>
            )}
        </div>
    );
};
