import antfu from "@antfu/eslint-config";

export default antfu(
  {
    type: "app",
    nextjs: true,
    react: true,
    typescript: true,
    formatters: true,
    stylistic: {
      indent: 2,
      semi: true,
      quotes: "double",
    },
    ignores: [
      "**/.next/*",
      "**/build/*",
      "**/.husky/*",
      ".open-next/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "ts/no-redeclare": "off",
      "ts/consistent-type-definitions": ["error", "type"],
      "no-console": ["warn"],
      "antfu/no-top-level-await": ["off"],
      "perfectionist/sort-imports": [
        "error",
      ],
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
          ignore: ["README.md"],
        },
      ],
      "style/jsx-max-props-per-line": ["error", { maximum: 1 }],
      "no-undef": "off",
      "node/prefer-global/process": ["off"],
      "node/no-process-env": ["error"],
      // Next.js App Router requires default exports for pages/layouts/error/loading
      "import/no-default-export": "off",
    },
  },
);
