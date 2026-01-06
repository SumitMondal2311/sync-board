"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { useSession } from "@/hooks/api/use-session";
import { workspaceStore } from "@/stores/workspace.store";

export const WorkspaceResolver = ({ children }: { children: React.ReactNode }) => {
    const [resolved, setResolved] = React.useState(false);
    const { data: session } = useSession();
    const { setActiveWorkspace } = workspaceStore();
    const activeWorkspaceId = workspaceStore((st) => st.activeWorkspace?.id);
    const router = useRouter();

    React.useEffect(() => {
        if (!session) return;

        const { workspaces } = session.data.user;
        if (workspaces.length === 1) {
            localStorage.setItem("active-workspace-id", workspaces[0].id);
            setActiveWorkspace(workspaces.find((ws) => ws.id === workspaces[0].id) ?? null);
            setResolved(true);
            return;
        }

        const resolvedWorkspace = workspaces.find(
            (ws) => ws.id === (localStorage.getItem("active-workspace-id") ?? "")
        );

        if (!resolvedWorkspace) {
            localStorage.removeItem("active-workspace-id");
            router.replace("/select-workspace");
            return;
        }

        setActiveWorkspace(resolvedWorkspace);
        setResolved(true);
    }, [session, setActiveWorkspace, router]);

    if (!resolved || !session || !activeWorkspaceId) {
        return null;
    }

    return children;
};
