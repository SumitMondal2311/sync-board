import { apiClient } from "@/lib/api-client";
import { authStore } from "@/stores/auth.store";
import { ApiError } from "@/types/api-error";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignOut = () => {
    const { session, setActiveWorkspace, setSession } = authStore();
    const router = useRouter();

    return useMutation<unknown, AxiosError<ApiError>>({
        mutationFn: () => apiClient.delete(`/me/sessions/${session?.id}`),
        onError: (error) => {
            if (error.response) {
                toast.error(error.response.data.message || "Internal server error");
            } else {
                toast.error("Something went wrong!");
            }
        },
        onSuccess: () => {
            router.push("/sign-in");
            setActiveWorkspace(null);
            setSession(null);
        },
    });
};
