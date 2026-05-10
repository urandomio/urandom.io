// Flat config for ESLint v9 — covers Astro components + plain TS/JS.
// Type-aware rules are intentionally avoided so this runs without a tsconfig project ref.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  navigator: 'readonly',
  console: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  requestAnimationFrame: 'readonly',
  cancelAnimationFrame: 'readonly',
  fetch: 'readonly',
  URL: 'readonly',
  URLSearchParams: 'readonly',
  performance: 'readonly',
  MutationObserver: 'readonly',
  Image: 'readonly',
  CustomEvent: 'readonly',
  Event: 'readonly',
  HTMLElement: 'readonly',
  HTMLCanvasElement: 'readonly',
  HTMLImageElement: 'readonly',
  HTMLInputElement: 'readonly',
};

const nodeGlobals = {
  process: 'readonly',
  Buffer: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',
  console: 'readonly',
};

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.astro/**',
      '.direnv/**',
      'public/**',
      'bun.lock',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  // Astro components — frontmatter is TS, body is HTML, inline <script> may be TS.
  // eslint-plugin-astro wires the right parsers for *.astro itself; we just relax noise here.
  {
    files: ['**/*.astro'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      // These pages use `el && (el.x = y)` short-circuit assignment and `el.offsetHeight;` reflow
      // triggers — well-established DOM idioms, not bugs.
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true },
      ],
      // d3 + Astro frontmatter occasionally needs `@ts-nocheck`; keep visible but non-blocking.
      '@typescript-eslint/ban-ts-comment': 'warn',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-useless-escape': 'warn',
    },
    languageOptions: {
      globals: { ...browserGlobals, ...nodeGlobals },
    },
  },
  // Inline <script> blocks inside .astro — these are virtual files extracted by the Astro parser
  // (e.g. `foo.astro/0_0.ts`). The Astro recommended preset matches them too, so we re-apply our
  // permissive idiom rules here to make sure they take precedence.
  {
    files: ['**/*.astro/*.ts', '**/*.astro/*.js'],
    languageOptions: {
      parser: tseslint.parser,
      globals: browserGlobals,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true },
      ],
      '@typescript-eslint/ban-ts-comment': 'warn',
      'no-useless-escape': 'warn',
    },
  },
  // Plain TS files under src/ and scripts/.
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...browserGlobals, ...nodeGlobals },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  // Plain JS / config files.
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...browserGlobals, ...nodeGlobals },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
];
