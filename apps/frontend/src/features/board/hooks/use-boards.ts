import { GetBoardsResponse } from "@repo/types/api";
import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import { workspaceStore } from "@/stores/workspace.store";

export const useBoards = () => {
    const activeWorkspace = workspaceStore((state) => state.activeWorkspace);

    return useQuery({
        queryKey: [activeWorkspace?.id, "boards"],
        retry: false,
        enabled: !!activeWorkspace,
        queryFn: () =>
            apiClient.get<GetBoardsResponse>("/me/boards", {
                headers: {
                    "x-workspace-id": activeWorkspace?.id,
                },
            }),
    });
};
