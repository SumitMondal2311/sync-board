"use client";

import * as React from "react";

import { useSession } from "@/hooks/api/use-session";
import { useRouter } from "next/navigation";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { isError, isSuccess } = useSession();

    React.useEffect(() => {
        if (isError) {
            router.push("/sign-in");
        }
    }, [isError, router]);

    if (isSuccess) {
        return children;
    }

    return null;
};

export { AuthGuard };
