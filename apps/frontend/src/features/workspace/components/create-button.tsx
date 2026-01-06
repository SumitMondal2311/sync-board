"use client";

import { Loader, Plus } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { workspaceStore } from "@/stores/workspace.store";
import { useCreateWorkspace } from "../hooks/use-create-workspace";

export const CreateWorkspaceButton = ({
    setOpenDropdown,
}: {
    setOpenDropdown: (st: boolean) => void;
}) => {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState("");

    const { mutate: createWorkspace, isPending, isSuccess, data: workspace } = useCreateWorkspace();
    const { setActiveWorkspace } = workspaceStore();

    React.useEffect(() => {
        if (isSuccess) {
            localStorage.setItem("active-workspace-id", workspace.data.id);
            setActiveWorkspace(workspace.data);
            setOpen(false);
            setOpenDropdown(false);
        }
    }, [isSuccess, setOpen]);

    React.useEffect(() => {
        setName("");
    }, [setOpen, open]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createWorkspace({ name });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="gap-2 p-2">
                    <div className="grid aspect-square h-8 place-items-center rounded-md border">
                        <Plus />
                    </div>
                    <div className="text-muted-foreground">Add workspace</div>
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="max-w-100!">
                <form onSubmit={onSubmit} className="space-y-3">
                    <DialogHeader>
                        <DialogTitle>Create Workspace</DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                        <Field className="gap-2">
                            <FieldLabel htmlFor="ws-name">Workspace name</FieldLabel>
                            <Input
                                id="ws-name"
                                required
                                placeholder="eg. UI/UX Team"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                        </Field>
                    </FieldGroup>
                    <Field>
                        <Button type="submit" disabled={isPending || name.length === 0}>
                            {isPending ? <Loader className="animate-spin" /> : null}
                            Create
                        </Button>
                    </Field>
                </form>
            </DialogContent>
        </Dialog>
    );
};
