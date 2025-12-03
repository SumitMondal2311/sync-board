import { SessionProvider } from "./_components/session-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}
