import { CreateWorkspaceResponse, CreateWorkspaceSchema } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

import { apiClient } from "@/lib/api-client";
import { ApiError } from "@/types/api-error";

export const useCreateWorkspace = () => {
    const qc = useQueryClient();

    return useMutation<
        AxiosResponse<CreateWorkspaceResponse>,
        AxiosError<ApiError>,
        CreateWorkspaceSchema
    >({
        mutationFn: (data) => apiClient.post("/me/workspaces", data),
        onError: (error) => {
            if (error.response) {
                toast.error(error.response.data.message || "Internal server error");
            } else {
                toast.error("Something went wrong!");
            }
        },
        onSuccess: () => {
            qc.removeQueries({ queryKey: ["session"], exact: false });
        },
    });
};
