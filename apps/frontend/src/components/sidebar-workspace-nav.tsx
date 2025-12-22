"use client";

import { LucideIcon, ReceiptText, Settings, SquareKanban, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const WORKSPACE_NAV_ITEMS: {
    icon: LucideIcon;
    url: string;
    label: string;
}[] = [
    {
        icon: SquareKanban,
        url: "/dashboard/boards",
        label: "Boards",
    },
    {
        icon: Users,
        url: "/dashboard/members",
        label: "Members",
    },
    {
        icon: ReceiptText,
        url: "/dashboard/billing",
        label: "Billing",
    },
    {
        icon: Settings,
        label: "Settings",
        url: "/dashboard/settings",
    },
];

export const SidebarWorkspaceNav = () => {
    const pathname = usePathname();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarMenu>
                {WORKSPACE_NAV_ITEMS.map((item, index) => (
                    <SidebarMenuItem key={index}>
                        <Link href={item.url}>
                            <SidebarMenuButton
                                tooltip={item.label}
                                className={
                                    pathname === item.url
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                        : ""
                                }
                            >
                                <item.icon />
                                {item.label}
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
};
