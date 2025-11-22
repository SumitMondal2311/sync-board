import { WorkspaceSelector } from "@/app/select-workspace/_components/workspace-selector";

export default function Page() {
    return (
        <main className="flex h-screen items-center justify-center px-6">
            <WorkspaceSelector />
        </main>
    );
}
