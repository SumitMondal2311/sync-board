import { SidebarWorkspaceNav } from "@/components/sidebar-workspace-nav";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserMenu } from "@/components/user-menu";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider className="h-screen">
            <Sidebar variant="inset" collapsible="icon">
                <SidebarHeader>
                    <WorkspaceSwitcher />
                </SidebarHeader>
                <SidebarContent>
                    <SidebarWorkspaceNav />
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                <header className="flex items-center justify-between p-2">
                    <SidebarTrigger />
                    <UserMenu />
                </header>
                <div className="flex-1 overflow-hidden p-4">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
