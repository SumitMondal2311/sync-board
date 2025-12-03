"use client";

import { Loader, PlusCircle } from "lucide-react";
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
import { useCreateBoard } from "@/hooks/mutations/use-create-board";

export const CreateBoardButton = () => {
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState("");
    const { mutate, isPending, isSuccess } = useCreateBoard();

    React.useEffect(() => {
        if (isSuccess) {
            setOpen(false);
        }
    }, [isSuccess, setOpen]);

    React.useEffect(() => {
        setTitle("");
    }, [setOpen, open]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate({ title });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setOpen(true)}>
                    <PlusCircle /> <span className="hidden sm:inline-block">Create board</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-100!">
                <form onSubmit={onSubmit} className="space-y-3">
                    <DialogHeader>
                        <DialogTitle>Create Board</DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                        <Field className="gap-2">
                            <FieldLabel htmlFor="title">Title</FieldLabel>
                            <Input
                                id="title"
                                required
                                placeholder="eg. Website Redesign Project"
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                            />
                        </Field>
                    </FieldGroup>
                    <Field>
                        <Button type="submit" disabled={isPending || title.length === 0}>
                            {isPending ? <Loader className="animate-spin" /> : null}
                            Create
                        </Button>
                    </Field>
                </form>
            </DialogContent>
        </Dialog>
    );
};
