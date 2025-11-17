import { Toaster } from "@/components/ui/sonner";
import { Geist_Mono, Outfit } from "next/font/google";
import "../styles/global.css";

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
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
            <body className={`${geistMono.variable} ${outfit.variable}`}>
                {children}
                <Toaster />
            </body>
        </html>
    );
}
