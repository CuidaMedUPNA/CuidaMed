import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["dist/"],
  },
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {},
  },
];
