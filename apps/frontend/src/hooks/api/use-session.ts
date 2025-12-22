import { GetSessionResponse } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

import { apiClient } from "@/lib/api-client";
import { ApiError } from "@/types/api-error";

export const useSession = () => {
    return useQuery<AxiosResponse<GetSessionResponse>, AxiosError<ApiError>>({
        queryKey: ["session"],
        retry: false,
        queryFn: () => apiClient.get("/me/sessions/current"),
    });
};
