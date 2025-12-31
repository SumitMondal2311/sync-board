import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    platform: "node",
    target: "node20",
    clean: true,
    shims: true,
    noExternal: ["@repo/database", "@repo/env", "@repo/validation", "@repo/types"],
    sourcemap: true,
    banner: {
        js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
    },
});
