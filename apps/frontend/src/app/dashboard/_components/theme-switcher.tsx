"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ThemeSwitcher() {
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    size="icon-sm"
                    variant="secondary"
                    onClick={() =>
                        setTheme(
                            resolvedTheme === "dark"
                                ? "light"
                                : resolvedTheme === "light"
                                  ? "dark"
                                  : "system"
                        )
                    }
                >
                    {resolvedTheme === "light" ? (
                        <Sun />
                    ) : resolvedTheme === "dark" ? (
                        <Moon />
                    ) : null}
                </Button>
            </TooltipTrigger>
            <TooltipContent align="end">Toggle theme</TooltipContent>
        </Tooltip>
    );
}
