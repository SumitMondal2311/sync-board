import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/lib/providers/query-provider";
import { Outfit, Space_Grotesk } from "next/font/google";
import "../styles/global.css";

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    display: "swap",
    subsets: ["latin"],
});

const outfit = Outfit({
    variable: "--font-outfit",
    display: "swap",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${spaceGrotesk.variable} ${outfit.variable}`}>
                <QueryProvider>{children}</QueryProvider>
                <Toaster />
            </body>
        </html>
    );
}
