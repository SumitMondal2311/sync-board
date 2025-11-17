"use client";

import { ReactNode, useEffect } from "react";

import { workspaces } from "@/configs/mock-data";
import { workspaceStore } from "@/stores/workspace.store";
import { useRouter } from "next/navigation";

export const WorkspaceValidator = ({ children }: { children: ReactNode }) => {
    const { activeWorkspace, setActiveWorkspace } = workspaceStore();

    const router = useRouter();

    useEffect(() => {
        const storedWorkspaceId = localStorage.getItem("active-workspace-id");
        if (storedWorkspaceId) {
            const matchedWorkspace = workspaces.find(
                (workspace) => workspace.id === storedWorkspaceId
            );

            if (matchedWorkspace) {
                setActiveWorkspace(matchedWorkspace);
            } else {
                router.push("/select-workspace");
                localStorage.removeItem("active-workspace-id");
            }
        } else {
            router.push("/select-workspace");
        }
    }, [router, setActiveWorkspace]);

    if (!activeWorkspace) {
        return null;
    } else {
        return children;
    }
};
