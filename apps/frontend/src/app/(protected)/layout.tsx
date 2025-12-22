import * as React from "react";

import { WorkspaceResolver } from "@/features/workspace/components/workspace-resolver";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <WorkspaceResolver>{children}</WorkspaceResolver>;
}
