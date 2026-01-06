"use client";

import { Building, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { CreateWorkspaceButton } from "@/features/workspace/components/create-button";
import { useSession } from "@/hooks/api/use-session";
import { useIsMobile } from "@/hooks/use-mobile";
import { workspaceStore } from "@/stores/workspace.store";
import { useState } from "react";

export const WorkspaceSwitcher = () => {
    const [openDropdown, setOpenDropdown] = useState(false);
    const { data: session } = useSession();
    const activeWorkspace = workspaceStore((st) => st.activeWorkspace);
    const { setActiveWorkspace } = workspaceStore();
    const isMobile = useIsMobile();

    const workspaces = session?.data.user.workspaces;

    const handleSelectWorkspace = (workspaceId: string) => {
        const resolvedWorkspace = workspaces?.find((ws) => ws.id === workspaceId);
        if (!resolvedWorkspace) {
            return toast.error("Something went wrong!");
        }

        setActiveWorkspace(resolvedWorkspace);
        localStorage.setItem("active-workspace-id", resolvedWorkspace.id);
    };

    if (!workspaces) {
        return null;
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            onSelect={(e) => e.preventDefault()}
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground grid aspect-square h-8 place-items-center rounded-md border">
                                <Building className="h-4" />
                            </div>
                            <span className="truncate">{activeWorkspace?.name}</span>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        sideOffset={8}
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
                    >
                        {workspaces.map((workspace, index) => (
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
                        <CreateWorkspaceButton setOpenDropdown={setOpenDropdown} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
};
