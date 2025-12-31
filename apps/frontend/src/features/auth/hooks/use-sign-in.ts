import { SignInSchema } from "@repo/types/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { apiClient } from "@/lib/api-client";
import { ApiError } from "@/types/api-error";

export const useSignIn = () => {
    const router = useRouter();

    return useMutation<unknown, AxiosError<ApiError>, SignInSchema>({
        mutationFn: (data: SignInSchema) => apiClient.post("/auth/sign-in", data),
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
