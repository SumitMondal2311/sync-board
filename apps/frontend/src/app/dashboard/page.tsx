import { Skeleton } from "@/components/ui/skeleton";
import { UserMenu } from "@/components/user-menu";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { WorkspaceValidator } from "@/components/workspace-validator";

const DashboardPage = () => {
    return (
        <WorkspaceValidator>
            <div className="relative flex h-screen flex-col divide-y">
                <nav className="flex w-full items-center justify-between px-3 py-2">
                    <WorkspaceSwitcher />
                    <UserMenu />
                </nav>
                <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6 xl:p-8">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4 xl:gap-8">
                        {Array.from({ length: 12 }, (_, idx) => (
                            <Skeleton key={idx} className="aspect-video" />
                        ))}
                    </div>
                </div>
            </div>
        </WorkspaceValidator>
    );
};

export default DashboardPage;
