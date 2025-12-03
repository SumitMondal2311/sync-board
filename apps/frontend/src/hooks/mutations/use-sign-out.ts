import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { apiClient } from "@/lib/api-client";
import { authStore } from "@/stores/auth.store";
import { workspaceStore } from "@/stores/workspace.store";
import { ApiError } from "@/types/api-error";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignOut = () => {
    const sessionId = authStore((st) => st.session?.id);
    const activeWorkspaceId = workspaceStore((st) => st.activeWorkspace?.id);
    const { onSignOut } = authStore();
    const router = useRouter();
    const qc = useQueryClient();

    return useMutation<unknown, AxiosError<ApiError>>({
        mutationFn: () => apiClient.delete(`/me/sessions/${sessionId}`),
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
            onSignOut();
            router.push("/sign-in");
        },
    });
};
