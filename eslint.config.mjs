import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import sonarjs from "eslint-plugin-sonarjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  sonarjs.configs.recommended,
  prettier,
  {
    // Opção B: complexidade/conascência avisam mas não quebram o build.
    // Quando a base estabilizar, mudar severidade para error.
    rules: {
      ...Object.fromEntries(
        Object.keys(sonarjs.rules ?? {}).map((rule) => [
          `sonarjs/${rule}`,
          "warn",
        ]),
      ),
      // Ruído puro pra este projeto — desligadas explicitamente:
      "sonarjs/file-header": "off", // header de arquivo não é obrigatório aqui
      "sonarjs/no-wildcard-import": "off", // barrels (index.ts) usam re-export *
      "sonarjs/arrow-function-convention": "off", // estilo, não bug
      "sonarjs/regular-expr": "off", // genérica demais (avisa em qualquer regex)
      "sonarjs/no-implicit-dependencies": "off", // resolve-import já cobre
      "sonarjs/file-name-differ-from-class": "off", // App Router exige page.tsx, layout.tsx, etc.
      "sonarjs/no-reference-error": "off", // false-positive com tipos React/JSX
      "sonarjs/cyclomatic-complexity": "off", // já cobrimos via complexity nativa
      "sonarjs/function-name": "off", // Next exige PascalCase em pages/components
      "sonarjs/no-hardcoded-passwords": "off", // false-positive em displayName/label
    },
  },
  {
    rules: {
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      // Complexidade ciclomática (ESLint nativo) — caminhos independentes por função.
      complexity: ["warn", { max: 10 }],
      // Profundidade máxima de aninhamento (if/for/while/switch).
      "max-depth": ["warn", 3],
      // Parâmetros posicionais — força uso de objeto quando passa de 3.
      "max-params": ["warn", 3],
      // Tamanho de função em código de lógica (.ts). Componentes (.tsx)
      // têm override mais permissivo abaixo — JSX ocupa linha sem ser
      // complexidade real.
      "max-lines-per-function": [
        "warn",
        { max: 80, skipBlankLines: true, skipComments: true, IIFEs: true },
      ],
      // Aninhamento de callbacks.
      "max-nested-callbacks": ["warn", 3],

      // Conascência cognitiva (sonarjs) — substitui complexity em casos sutis.
      "sonarjs/cognitive-complexity": ["warn", 15],
      // Strings duplicadas → vão pra constants/.
      "sonarjs/no-duplicate-string": ["warn", { threshold: 3 }],
      // Não usar literais como flags / status mágicos.
      "sonarjs/no-nested-template-literals": "warn",
      // Branches idênticos (geralmente bug ou code smell).
      "sonarjs/no-identical-functions": "warn",
      // Switches sem default ou com cases idênticos.
      "sonarjs/no-small-switch": "warn",

      // ---------- Acessibilidade (jsx-a11y) ----------
      // Garantir que tudo seja navegável por teclado e tenha semântica correta.
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
      "jsx-a11y/no-noninteractive-element-interactions": "warn",
      "jsx-a11y/no-noninteractive-tabindex": "warn",
      "jsx-a11y/interactive-supports-focus": "warn",
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/label-has-associated-control": "warn",
      "jsx-a11y/no-autofocus": "warn",
      "jsx-a11y/tabindex-no-positive": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/services/api/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "axios",
              message:
                "Use the centralized apiClient from '@/services/api' instead of importing axios directly.",
            },
          ],
        },
      ],
    },
  },
  {
    // Componentes React (.tsx): limite de tamanho mais permissivo porque JSX
    // ocupa muitas linhas sem adicionar lógica/complexidade real.
    files: ["src/**/*.tsx"],
    rules: {
      "max-lines-per-function": [
        "warn",
        { max: 150, skipBlankLines: true, skipComments: true, IIFEs: true },
      ],
    },
  },
  {
    // Mocks: Math.random é seguro (não é uso criptográfico).
    files: ["src/mocks/**"],
    rules: {
      "sonarjs/pseudo-random": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
]);

export default eslintConfig;
