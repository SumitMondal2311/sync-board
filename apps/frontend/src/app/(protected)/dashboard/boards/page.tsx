import { BoardsGrid } from "@/features/board/components/grid";

export default function Page() {
    return (
        <div className="flex h-full flex-col space-y-4 divide-y">
            <div className="flex items-center py-2">
                <h1 className="font-mono text-2xl font-semibold">Boards</h1>
            </div>
            <BoardsGrid />
        </div>
    );
}
