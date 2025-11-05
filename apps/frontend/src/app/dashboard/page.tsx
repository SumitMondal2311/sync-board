import { apiClient } from "@/lib/api-client";
import { getQueryClient } from "@/lib/get-query-client";
import { UserAPIContext } from "@repo/types";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import DashboardComponent from "./component";

export default async function DashboardPage() {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery<{ user: UserAPIContext }>({
        queryKey: ["session"],
        queryFn: () => apiClient.get("/api/v1/me"),
    });

    const dehydrateState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydrateState}>
            <DashboardComponent />
        </HydrationBoundary>
    );
}
