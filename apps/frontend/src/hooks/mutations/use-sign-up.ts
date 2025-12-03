import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { apiClient } from "@/lib/api-client";
import { ApiError } from "@/types/api-error";
import { AuthSchema } from "@repo/types";

export const useSignUp = () => {
    return useMutation<unknown, AxiosError<ApiError>, AuthSchema>({
        mutationFn: (data: AuthSchema) => apiClient.post("/auth/sign-up", data),
    });
};
