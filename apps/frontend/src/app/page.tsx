export default function Page() {
    return (
        <div className="flex h-screen items-center justify-center">
            Running on {process.env.NODE_ENV} environment.
        </div>
    );
}
