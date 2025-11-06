"use client";

import { useAuthStore } from "@/features/auth/auth.store";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { apiClient } from "@/lib/api-client";
import { SessionAPIContext } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { useEffect } from "react";

export default function DashboardComponent() {
    const { session, setSession } = useAuthStore();

    const { isLoading, isSuccess, data } = useQuery<
        void,
        AxiosError<ApiError>,
        AxiosResponse<{ session: SessionAPIContext }>
    >({
        queryKey: ["session"],
        queryFn: () => apiClient.get("/api/v1/me/sessions/current"),
    });

    useEffect(() => {
        if (isSuccess) {
            setSession(data.data.session);
        }
    }, [isSuccess, setSession, data]);

    if (isLoading) return;

    return (
        <div className="flex h-screen items-center justify-center">
            <SignOutButton className="absolute top-4 right-4" />
            Email Address: {session?.user.emailAddress}
        </div>
    );
}
