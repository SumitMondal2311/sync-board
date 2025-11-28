"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { apiClient } from "@/lib/api-client";
import { authStore } from "@/stores/auth.store";
import { GetSessionAPISuccessResponse } from "@repo/types";
import { useQuery } from "@tanstack/react-query";

export const WorkspaceGuard = ({ children }: { children: React.ReactNode }) => {
    const activeWorkspace = authStore((state) => state.activeWorkspace);
    const setActiveWorkspace = authStore((state) => state.setActiveWorkspace);
    const setSession = authStore((state) => state.setSession);
    const router = useRouter();

    const { isLoading, isSuccess, data } = useQuery({
        queryKey: ["session"],
        queryFn: () =>
            apiClient.get<{ session: GetSessionAPISuccessResponse }>("/me/sessions/current"),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnReconnect: true,
    });

    React.useEffect(() => {
        if (isSuccess) {
            setSession(data.data.session);
        }
    }, [isSuccess, setSession, data]);

    React.useEffect(() => {
        if (isSuccess) {
            const {
                session: {
                    user: { workspaces },
                },
            } = data.data;
            const storedWorkspaceId = localStorage.getItem("active-workspace-id");
            if (workspaces.length === 1) {
                setActiveWorkspace(workspaces[0]);
                if (storedWorkspaceId !== workspaces[0].id) {
                    localStorage.setItem("active-workspace-id", workspaces[0].id);
                }
            }

            if (workspaces.length > 1) {
                if (storedWorkspaceId) {
                    const resolvedWorkspace = workspaces.find(
                        (workspace) => workspace.id === storedWorkspaceId
                    );

                    if (resolvedWorkspace) {
                        setActiveWorkspace(resolvedWorkspace);
                    } else {
                        router.replace("/select-workspace");
                        localStorage.removeItem("active-workspace-id");
                    }
                } else {
                    router.replace("/select-workspace");
                }
            }
        }
    }, [isSuccess, data, router, setActiveWorkspace]);

    if (isLoading) {
        return null;
    }

    if (!activeWorkspace) {
        return null;
    }

    return <>{children}</>;
};
