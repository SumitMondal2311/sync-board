import { config as baseConfig } from "@repo/eslint-config";
import globals from "globals";

export default [
    ...baseConfig,
    {
        languageOptions: {
            parserOptions: {
                project: ["tsconfig.json"],
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.node,
            },
        },
    },
];
