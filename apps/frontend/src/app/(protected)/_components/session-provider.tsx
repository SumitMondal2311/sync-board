"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";

import { apiClient } from "@/lib/api-client";
import { authStore } from "@/stores/auth.store";
import { workspaceStore } from "@/stores/workspace.store";
import { GetSessionAPISuccessResponse } from "@repo/types";
import { useRouter } from "next/navigation";

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const activeWorkspaceId = workspaceStore((st) => st.activeWorkspace?.id);
    const { setSession, onSignOut } = authStore();
    const router = useRouter();
    const qc = useQueryClient();

    const { isLoading, isError, isSuccess, data } = useQuery({
        queryKey: ["session"],
        retry: 1,
        queryFn: () =>
            apiClient.get<{ session: GetSessionAPISuccessResponse }>("/me/sessions/current"),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });

    React.useEffect(() => {
        if (isError) {
            qc.removeQueries({ queryKey: ["session"] });
            qc.removeQueries({ queryKey: [activeWorkspaceId, "boards"] });
            onSignOut();
            router.push("/sign-in");
        }
        if (isSuccess) {
            setSession(data.data.session);
        }
    }, [isError, qc, activeWorkspaceId, onSignOut, router, isSuccess, setSession, data]);

    if (isLoading) {
        return null;
    }

    return children;
};
