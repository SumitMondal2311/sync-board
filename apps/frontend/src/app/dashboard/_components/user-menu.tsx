"use client";

import { Bell, LogOut, LucideIcon, Settings, SquareUser } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const USER_MENU_ITEMS: {
    icon: LucideIcon;
    label: string;
}[] = [
    {
        icon: SquareUser,
        label: "Account",
    },
    {
        icon: Settings,
        label: "Settings",
    },
    {
        icon: Bell,
        label: "Notifications",
    },
];

export const UserMenu = () => {
    const isMobile = useIsMobile();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar>
                                <AvatarImage src="#" />
                                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                                    YN
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid leading-tight">
                                <span className="truncate">Your Name</span>
                                <span className="text-muted-foreground truncate text-xs">
                                    yourname@example.com
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        sideOffset={8}
                        align="end"
                        side={isMobile ? "top" : "right"}
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
                    >
                        <DropdownMenuGroup>
                            {USER_MENU_ITEMS.map((item, index) => (
                                <DropdownMenuItem key={index}>
                                    <item.icon />
                                    {item.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                            <LogOut /> Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
};
