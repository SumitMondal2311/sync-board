import * as React from "react";

import { AuthGuard } from "@/features/auth/components/guard";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <AuthGuard>{children}</AuthGuard>;
}
