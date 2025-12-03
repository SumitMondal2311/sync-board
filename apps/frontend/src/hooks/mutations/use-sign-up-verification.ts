import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { apiClient } from "@/lib/api-client";
import { ApiError } from "@/types/api-error";
import { VerificationCodeSchema } from "@repo/types";

export const useSignUpVerification = () => {
    const router = useRouter();

    return useMutation<unknown, AxiosError<ApiError>, VerificationCodeSchema>({
        mutationFn: (data: VerificationCodeSchema) => apiClient.post("/auth/sign-up/verify", data),
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
