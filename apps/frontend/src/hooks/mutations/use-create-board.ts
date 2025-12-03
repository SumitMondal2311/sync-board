import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

import { apiClient } from "@/lib/api-client";
import { workspaceStore } from "@/stores/workspace.store";
import { ApiError } from "@/types/api-error";
import { CreateBoardAPISuccessResponse, TitleSchema } from "@repo/types";

export const useCreateBoard = () => {
    const { activeWorkspace } = workspaceStore();

    return useMutation<
        AxiosResponse<{ board: CreateBoardAPISuccessResponse }>,
        AxiosError<ApiError>,
        TitleSchema
    >({
        mutationFn: (data) =>
            apiClient.post("/me/boards", data, {
                headers: {
                    "x-workspace-id": activeWorkspace?.id,
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
            if (response) {
                workspaceStore.setState((state) => ({
                    boards: [...state.boards, response.data.board],
                }));
            }
        },
    });
};
