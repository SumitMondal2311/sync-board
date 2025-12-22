import { PrepareVerifyEmailResponse } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

import { apiClient } from "@/lib/api-client";
import { ApiError } from "@/types/api-error";

export const usePrepareVerifyEmail = () => {
    return useQuery<AxiosResponse<PrepareVerifyEmailResponse>, AxiosError<ApiError>>({
        queryKey: ["verify-email"],
        retry: false,
        queryFn: () => apiClient.get("/auth/verify-email/prepare"),
    });
};
