import eslintjs from "@eslint/js";
import configPrettier from "eslint-config-prettier";
import pluginTurbo from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";

/** @type {import("eslint").Linter.Config[]} */

export const config = [
    eslintjs.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
        },
    },
    {
        plugins: {
            "@typescript-eslint": tseslint.plugin,
            turbo: pluginTurbo,
        },
        rules: {
            "turbo/no-undeclared-env-vars": "warn",
        },
    },
    configPrettier,
];
