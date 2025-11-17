"use client";

import { Building, ChevronsUpDown, Plus } from "lucide-react";

import { workspaces } from "@/configs/mock-data";
import { useIsMobile } from "@/hooks/use-mobile";
import { workspaceStore } from "@/stores/workspace.store";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const WorkspaceSwitcher = () => {
    const { activeWorkspace, setActiveWorkspace } = workspaceStore();
    const isMobile = useIsMobile();

    if (!activeWorkspace) {
        return null;
    }

    const handleSelectWorkspace = (workspaceId: string) => {
        setActiveWorkspace(workspaces.find((workspace) => workspace.id === workspaceId));
        localStorage.setItem("active-workspace-id", workspaceId);
    };

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="max-w-60">
                        <Building />
                        <span className="truncate font-mono">{activeWorkspace.name}</span>
                        <ChevronsUpDown />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="max-h-100 w-60"
                    align="start"
                    side={isMobile ? "bottom" : "right"}
                    sideOffset={4}
                >
                    <DropdownMenuLabel className="text-muted-foreground text-xs">
                        Workspaces
                    </DropdownMenuLabel>
                    {workspaces.map((workspace, index) => (
                        <DropdownMenuItem
                            key={index}
                            onClick={() => handleSelectWorkspace(workspace.id)}
                            className="gap-2 p-2"
                        >
                            <div className="flex size-7 items-center justify-center rounded-md border">
                                <Building />
                            </div>
                            <div className="flex flex-1 items-center justify-between">
                                {workspace.name}
                                {workspace.name === activeWorkspace.name ? (
                                    <span className="bg-muted text-muted-foreground rounded-full px-2 py-[2px] text-xs">
                                        active
                                    </span>
                                ) : null}
                            </div>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 p-2">
                        <div className="flex size-7 items-center justify-center rounded-md border">
                            <Plus />
                        </div>
                        <div className="text-muted-foreground">Add workspace</div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
