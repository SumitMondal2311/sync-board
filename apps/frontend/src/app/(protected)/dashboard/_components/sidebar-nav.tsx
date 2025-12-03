"use client";

import { LucideIcon, ReceiptText, Settings, SquareKanban, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const SIDEBAR_NAV_ITEMS: {
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

export const SidebarNav = () => {
    const pathname = usePathname();

    return (
        <SidebarGroup>
            <SidebarMenu>
                {SIDEBAR_NAV_ITEMS.map((item, index) => (
                    <SidebarMenuItem key={index}>
                        <Link href={item.url}>
                            <SidebarMenuButton
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
