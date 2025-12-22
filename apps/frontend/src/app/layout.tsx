import { ThemeProvider } from "next-themes";
import { Geist_Mono, Outfit } from "next/font/google";
import * as React from "react";

import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/providers/query-provider";
import "@/styles/global.css";

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

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistMono.variable} ${outfit.variable}`}>
                <ThemeProvider
                    attribute="class"
                    enableSystem
                    themes={["dark", "light", "system"]}
                    defaultTheme="system"
                >
                    <QueryProvider>{children}</QueryProvider>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
