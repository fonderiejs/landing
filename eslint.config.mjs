import nextConfig from 'eslint-config-next';

const config = [
  ...nextConfig,
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**'],
  },
  {
    rules: {
      // The mounted-flag pattern (useEffect(() => setMounted(true), []))
      // guards SSR-unsafe reads (window, localStorage, createPortal) and
      // is unavoidable without a bigger useSyncExternalStore rewrite.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];

export default config;
