import pluginNext from "@next/eslint-plugin-next";
import { config } from "@repo/eslint-config";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
    {
        plugins: { react: pluginReact },
        rules: {
            ...pluginReact.configs.recommended.rules,
            "react/react-in-jsx-scope": "off",
        },
    },
    {
        plugins: { "react-hooks": pluginReactHooks },
        rules: {
            ...pluginReactHooks.configs.recommended.rules,
        },
    },
    {
        plugins: { "@next/next": pluginNext },
        rules: {
            ...pluginNext.configs["core-web-vitals"].rules,
            ...pluginNext.configs.recommended.rules,
        },
    },
    ...config,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },
            parserOptions: {
                project: ["tsconfig.json"],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        settings: {
            react: { version: "detect" },
        },
    },
];
