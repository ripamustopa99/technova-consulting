import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // 'any' is acceptable for form handlers, server actions, and Prisma responses
      "@typescript-eslint/no-explicit-any": "warn",
      // Hydration guard pattern (setMounted) is intentional
      "react-hooks/set-state-in-effect": "off",
      // External Cloudinary URLs are not compatible with next/image optimization
      "@next/next/no-img-element": "warn",
    },
  },
]);

export default eslintConfig;
