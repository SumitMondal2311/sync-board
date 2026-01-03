"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { useSession } from "@/hooks/api/use-session";
import { workspaceStore } from "@/stores/workspace.store";

export const WorkspaceResolver = ({ children }: { children: React.ReactNode }) => {
    const [mounted, setMounted] = React.useState(false);
    const { data: session } = useSession();
    const { setActiveWorkspace } = workspaceStore();
    const activeWorkspaceId = workspaceStore((st) => st.activeWorkspace?.id);
    const router = useRouter();

    const workspaces = session?.data.user.workspaces;

    React.useEffect(() => {
        setTimeout(() => {
            setMounted(true);
        }, 250);
    }, [setMounted]);

    React.useEffect(() => {
        if (!workspaces) return;
        const storedWorkspaceId = localStorage.getItem("active-workspace-id");
        if (workspaces.length === 1) {
            localStorage.setItem("active-workspace-id", workspaces[0].id);
            setActiveWorkspace(workspaces.find((ws) => ws.id === workspaces[0].id) ?? null);
            return;
        }

        const resolvedWorkspace = workspaces?.find((ws) => ws.id === storedWorkspaceId);
        if (!storedWorkspaceId || !resolvedWorkspace) {
            localStorage.removeItem("active-workspace-id");
            router.replace("/select-workspace");
            return;
        }

        setActiveWorkspace(resolvedWorkspace);
    }, [workspaces, router, setActiveWorkspace]);

    if (!workspaces || !mounted || !activeWorkspaceId) {
        return null;
    }

    return children;
};
