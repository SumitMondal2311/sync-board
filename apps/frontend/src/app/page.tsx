export default function LandingPage() {
    return (
        <div className="h-screen flex items-center justify-center">
            Running on {process.env.NODE_ENV} environment.
        </div>
    );
}
