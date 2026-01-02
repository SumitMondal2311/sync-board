import { VerifyEmailSchema } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { apiClient } from "@/lib/api-client";
import { ApiError } from "@/types/api-error";

export const useAttemptVerifyEmail = () => {
    const router = useRouter();

    return useMutation<unknown, AxiosError<ApiError>, VerifyEmailSchema>({
        mutationFn: (data: VerifyEmailSchema) => apiClient.post("/auth/verify-email/attempt", data),
        onError: (error) => {
            if (error.response) {
                toast.error(error.response.data.message || "Internal server error");
            } else {
                toast.error("Something went wrong!");
            }
        },
        onSuccess: () => {
            router.push("/dashboard/boards");
        },
    });
};
