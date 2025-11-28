"use client";

import { Bell, LogOut, LucideIcon, Settings, SquareUser } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { useSignOut } from "@/hooks/mutations/use-sign-out";
import { useIsMobile } from "@/hooks/use-mobile";
import { authStore } from "@/stores/auth.store";

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
    const { mutate, isPending } = useSignOut();
    const user = authStore((state) => state.session?.user);
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
                                    {user?.firstName && user?.lastName
                                        ? `${user.firstName.charAt(0).toUpperCase()} ${user.lastName.charAt(0).toUpperCase()}`
                                        : user?.email.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid leading-tight">
                                <span className="truncate">
                                    {user?.firstName && user?.lastName
                                        ? `${user.firstName} ${user.lastName}`
                                        : `${user?.email.split("@")[0]}`}
                                </span>
                                <span className="text-muted-foreground truncate text-xs">
                                    {user?.email}
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
                        <AlertDialog>
                            <AlertDialogTrigger className="w-full">
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <LogOut /> Sign Out
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                {isPending ? (
                                    <div className="bg-background/50 absolute inset-0 z-10 rounded-md" />
                                ) : null}
                                <AlertDialogHeader className="gap-0">
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        You will be signed out from this session. You can sign in
                                        again anytime.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => mutate()}
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
};
