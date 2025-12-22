import { SignUpSchema } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { apiClient } from "@/lib/api-client";
import { ApiError } from "@/types/api-error";

export const useSignUp = () => {
    return useMutation<unknown, AxiosError<ApiError>, SignUpSchema>({
        mutationFn: (data: SignUpSchema) => apiClient.post("/auth/sign-up", data),
    });
};
