"use client";

import { Loader } from "lucide-react";
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
import { useCreateBoard } from "../hooks/use-create-board";

export const CreateBoardButton = () => {
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState("");

    const { mutate: createBoard, isPending, isSuccess } = useCreateBoard();

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
        createBoard({ title });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="bg-muted/50 hover:bg-muted text-muted-foreground grid aspect-video cursor-pointer place-items-center rounded-md border p-2 text-sm transition-colors">
                    Create new board
                </div>
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
