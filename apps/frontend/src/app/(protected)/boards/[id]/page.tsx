export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id: boardId } = await params;

    return <div className="grid h-screen place-items-center">{boardId}</div>;
}
