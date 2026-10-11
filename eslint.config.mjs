import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import noUnsanitized from 'eslint-plugin-no-unsanitized';
import regexp from 'eslint-plugin-regexp';

// Security rules from security/06 §2. Each rule names the SEC-* rule it enforces.
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  noUnsanitized.configs.recommended, // SEC-CODE-01: innerHTML, insertAdjacentHTML, document.write
  regexp.configs['flat/recommended'], // SEC-CODE-20: unsafe or inefficient regexes
  {
    rules: {
      'no-eval': 'error', // SEC-CODE-03
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error', // SEC-CODE-04
      'react/no-danger': 'error', // SEC-CODE-01
      'react/jsx-no-script-url': 'error',
      'react/jsx-no-target-blank': ['error', { allowReferrer: false }], // SEC-CODE-13
      'no-console': ['warn', { allow: ['error'] }], // SEC-CODE-18
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.property.name=/^(pushState|replaceState)$/]',
          message: 'SEC-CODE-09: no history changes on input (back-button hijacking).',
        },
      ],
    },
  },
  {
    files: ['lib/calculators/**', 'components/**'],
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'fetch', message: 'SEC-CODE-10: calculators make no network calls.' },
        { name: 'XMLHttpRequest', message: 'SEC-CODE-10: calculators make no network calls.' },
      ],
    },
  },
  {
    files: ['lib/calculators/**', 'lib/seo/**'],
    rules: { '@typescript-eslint/no-explicit-any': 'error' }, // SEC-CODE-19
  },
  {
    files: ['components/JsonLd.tsx'], // the one allowed exception (SEC-CODE-02)
    rules: { 'react/no-danger': 'off' },
  },
  {
    files: ['scripts/**', '*.config.*'],
    rules: { 'no-console': 'off' },
  },
  globalIgnores(['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts', 'test-results/**', 'playwright-report/**', 'docs/**']),
]);
