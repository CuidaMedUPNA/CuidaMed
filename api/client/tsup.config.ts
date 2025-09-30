import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/generated/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  outDir: "dist",
  clean: true,
});
