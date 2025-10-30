import { config } from "@repo/eslint-config";
import globals from "globals";

export default [
    ...config,
    {
        languageOptions: {
            parserOptions: {
                project: "tsconfig.json",
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.node,
            },
        },
    },
];
