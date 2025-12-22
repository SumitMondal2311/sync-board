"use client";

import { Building } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/hooks/api/use-session";

export const WorkspaceSelector = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const handleSelectWorkspace = (workspaceId: string) => {
        localStorage.setItem("active-workspace-id", workspaceId);
        router.replace("/dashboard/boards");
    };

    const workspaces = session?.data.user.workspaces;
    if (!workspaces) {
        return null;
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="gap-0">
                <CardTitle className="font-mono text-2xl">Select workspace</CardTitle>
                <CardDescription>Please choose a workspace to continue</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent>
                <div className="max-h-64 divide-y overflow-y-auto rounded-md border md:max-h-80">
                    {workspaces.map((workspace, index) => (
                        <button
                            key={index}
                            onClick={() => handleSelectWorkspace(workspace.id)}
                            className="hover:bg-accent flex w-full cursor-pointer items-center gap-2 p-3 transition-colors"
                        >
                            <div className="grid aspect-square h-8 place-items-center rounded-md border">
                                <Building className="h-4" />
                            </div>
                            <span className="truncate text-sm">{workspace.name}</span>
                        </button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
