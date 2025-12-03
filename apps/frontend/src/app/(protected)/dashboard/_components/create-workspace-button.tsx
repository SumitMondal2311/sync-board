"use client";

import { Plus } from "lucide-react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export const CreateWorkspaceButton = () => {
    return (
        <DropdownMenuItem className="gap-2 p-2">
            <div className="grid aspect-square h-8 place-items-center rounded-md border">
                <Plus />
            </div>
            <div className="text-muted-foreground">Add workspace</div>
        </DropdownMenuItem>
    );
};
