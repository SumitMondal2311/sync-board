"use client";

import { LampDesk, Plus } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { workspaces } from "@/configs/mock-data";
import { workspaceStore } from "@/stores/workspace.store";
import { useRouter } from "next/navigation";

export const WorkspaceSelector = () => {
    const { setActiveWorkspace } = workspaceStore();
    const router = useRouter();

    const handleSelectWorkspace = (workspaceId: string) => {
        setActiveWorkspace(workspaces.find((workspace) => workspace.id === workspaceId));
        localStorage.setItem("active-workspace-id", workspaceId);
        router.push("/dashboard");
    };

    return (
        <div className="w-full max-w-sm rounded-md border shadow-md">
            <div className="p-6 leading-tight">
                <h1 className="font-mono font-medium">Select workspace</h1>
                <p className="text-muted-foreground text-sm">
                    Please choose a workspace to continue
                </p>
            </div>
            <Separator />
            <div className="max-h-96 gap-0 divide-y overflow-y-scroll p-0">
                {workspaces.map((workspace, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelectWorkspace(workspace.id)}
                        className="hover:bg-accent flex w-full items-center gap-2 p-3 transition-colors"
                    >
                        <span className="rounded-md border p-2">
                            <LampDesk size={16} className="text-muted-foreground" />
                        </span>
                        {workspace.name}
                    </button>
                ))}
            </div>
            <Separator />
            <div className="p-2">
                <button className="hover:bg-accent text-muted-foreground flex w-full items-center justify-center gap-2 rounded-md p-2 transition-colors">
                    <span className="rounded-md border p-2">
                        <Plus size={16} />
                    </span>
                    Add workspace
                </button>
            </div>
        </div>
    );
};
