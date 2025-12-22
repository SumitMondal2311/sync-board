import globals from "globals";

import { config } from "@repo/eslint-config";

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
