import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitest.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["test/*.test.ts"],
    globals: true,
    setupFiles: ["./test/setup.ts"], 
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "html"],
    },
  },
  resolve: {
    conditions: ["node", "import", "default"],
  },
});
