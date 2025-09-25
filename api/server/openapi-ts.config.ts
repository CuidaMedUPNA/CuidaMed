import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../openapi.yaml",
  output: {
    path: "./src/generated",
    format: "prettier",
  },
  plugins: [{ name: "fastify", exportFromIndex: true }],
});
