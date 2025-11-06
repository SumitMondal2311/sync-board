"use client";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/utils/cn";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes, useCallback } from "react";
import { useAuthStore } from "../auth.store";

export const SignOutButton = ({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) => {
    const { session } = useAuthStore();
    const router = useRouter();

    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: () => apiClient.delete(`/api/v1/me/sessions/${session?.id}`),
        onSuccess: () => router.push("/sign-in"),
    });

    return (
        <Button
            variant="destructive"
            onClick={useCallback(() => {
                mutate(undefined);
            }, [mutate])}
            disabled={isPending || isSuccess}
            className={cn("w-24 cursor-pointer", className)}
            {...rest}
        >
            {isPending || isSuccess ? (
                <>
                    <Loader2 className="animate-spin" />
                </>
            ) : (
                "Sign Out"
            )}
        </Button>
    );
};
