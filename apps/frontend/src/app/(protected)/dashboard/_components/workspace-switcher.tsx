"use client";

import { Building, ChevronsUpDown } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { authStore } from "@/stores/auth.store";
import { workspaceStore } from "@/stores/workspace.store";
import { CreateWorkspaceButton } from "./create-workspace-button";

export const WorkspaceSwitcher = () => {
    const activeWorkspace = workspaceStore((st) => st.activeWorkspace);
    const workspaces = authStore((st) => st.session?.user.workspaces);
    const { setActiveWorkspace } = workspaceStore();
    const isMobile = useIsMobile();

    if (!activeWorkspace) {
        return null;
    }

    const handleSelectWorkspace = (workspaceId: string) => {
        setActiveWorkspace(workspaces?.find((workspace) => workspace.id === workspaceId) ?? null);
        localStorage.setItem("active-workspace-id", workspaceId);
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground grid aspect-square h-8 place-items-center rounded-md border">
                                <Building className="h-4" />
                            </div>
                            <span className="truncate">{activeWorkspace.name}</span>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        sideOffset={8}
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
                    >
                        {workspaces?.map((workspace, index) => (
                            <DropdownMenuItem
                                key={index}
                                onClick={() => handleSelectWorkspace(workspace.id)}
                                className="gap-2 p-2"
                            >
                                <div className="grid aspect-square h-8 place-items-center rounded-md border">
                                    <Building />
                                </div>
                                <span className="truncate">{workspace.name}</span>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <CreateWorkspaceButton />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
};
