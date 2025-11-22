"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { workspaces } from "@/configs/mock-data";
import { workspaceStore } from "@/stores/workspace.store";

export const WorkspaceGuard = ({ children }: { children: React.ReactNode }) => {
    const { activeWorkspace, setActiveWorkspace } = workspaceStore();
    const router = useRouter();

    React.useEffect(() => {
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
    }, [router, setActiveWorkspace]);

    if (!activeWorkspace) {
        return null;
    } else {
        return children;
    }
};
