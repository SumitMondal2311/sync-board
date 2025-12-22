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

import { useSession } from "@/hooks/api/use-session";
import { useSignOut } from "@/hooks/api/use-sign-out";

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
    const { mutate: signOut, isPending } = useSignOut();
    const { data: session } = useSession();

    if (!session) {
        return null;
    }

    const { user } = session.data;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src="#" />
                    <AvatarFallback>
                        <span className="text-sm">
                            {user.firstName.charAt(0).toUpperCase()}
                            {user.lastName ? user.lastName.charAt(0).toUpperCase() : null}
                        </span>
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={8} align="end" side="bottom" className="w-56">
                <DropdownMenuGroup className="p-2">
                    <p className="truncate text-sm">
                        {user.firstName} {user.lastName ? user.lastName : null}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">{user.email}</p>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
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
                                You will be signed out from this session. You can sign in again
                                anytime.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => signOut({ sessionId: session.data.id })}
                            >
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
