import { CreateBoardResponse, CreateBoardSchema } from "@repo/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { apiClient } from "@/lib/api-client";
import { boardStore } from "@/stores/board.store";
import { workspaceStore } from "@/stores/workspace.store";
import { ApiError } from "@/types/api-error";

export const useCreateBoard = () => {
    const activeWorkspaceId = workspaceStore((st) => st.activeWorkspace?.id);
    const qc = useQueryClient();
    const router = useRouter();

    return useMutation<AxiosResponse<CreateBoardResponse>, AxiosError<ApiError>, CreateBoardSchema>(
        {
            mutationFn: (data) =>
                apiClient.post("/me/boards", data, {
                    headers: {
                        "x-workspace-id": activeWorkspaceId,
                    },
                }),
            onError: (error) => {
                if (error.response) {
                    toast.error(error.response.data.message || "Internal server error");
                } else {
                    toast.error("Something went wrong!");
                }
            },
            onSuccess: (response) => {
                router.push(`/dashboard/boards/${response.data.id}`);
                boardStore.setState((st) => ({
                    boards: [...st.boards, response.data],
                }));
                qc.removeQueries({ queryKey: [activeWorkspaceId, "boards"], exact: false });
            },
        }
    );
};
