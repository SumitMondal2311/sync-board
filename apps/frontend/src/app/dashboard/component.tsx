"use client";

import { useAuthStore } from "@/features/auth/auth.store";
import { apiClient } from "@/lib/api-client";
import { UserAPIContext } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { useEffect } from "react";

export default function DashboardComponent() {
    const { user, setUser } = useAuthStore();

    const { isLoading, isSuccess, data } = useQuery<
        { user: UserAPIContext },
        AxiosError<ApiError>,
        AxiosResponse<{ user: UserAPIContext }>
    >({
        queryKey: ["session"],
        queryFn: () => apiClient.get("/api/v1/me"),
    });

    useEffect(() => {
        if (isSuccess) {
            setUser(data.data.user);
        }
    }, [isSuccess, setUser, data]);

    if (isLoading) return;

    return (
        <div className="flex h-screen items-center justify-center">
            Email Address: {user?.emailAddress}
        </div>
    );
}
