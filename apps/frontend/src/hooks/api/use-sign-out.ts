import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { apiClient } from "@/lib/api-client";
import { workspaceStore } from "@/stores/workspace.store";
import { ApiError } from "@/types/api-error";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignOut = () => {
    const activeWorkspaceId = workspaceStore((st) => st.activeWorkspace?.id);
    const qc = useQueryClient();
    const router = useRouter();

    return useMutation<unknown, AxiosError<ApiError>, { sessionId: string }>({
        mutationFn: ({ sessionId }) => apiClient.delete(`/me/sessions/${sessionId}`),
        onError: (error) => {
            if (error.response) {
                toast.error(error.response.data.message || "Internal server error");
            } else {
                toast.error("Something went wrong!");
            }
        },
        onSuccess: () => {
            qc.removeQueries({ queryKey: ["session"], exact: false });
            qc.removeQueries({ queryKey: [activeWorkspaceId, "boards"], exact: false });
            router.push("/sign-in");
        },
    });
};
