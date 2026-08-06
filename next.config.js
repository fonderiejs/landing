const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

// GitHub Pages serves either:
//   - username.github.io/repo-name  -> needs basePath: '/repo-name'
//   - a custom domain (via CNAME)   -> needs basePath: ''
// This repo deploys to a custom domain (see CNAME), so basePath is empty.
// If you fork this without a custom domain, set NEXT_BASE_PATH to
// '/your-repo-name' in the deploy workflow's env instead.
const basePath = process.env.NEXT_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: {
    // GitHub Pages has no image-optimization server - ship raw files.
    unoptimized: true,
  },
  // Don't auto-generate/rewrite AGENTS.md and CLAUDE.md on every `next dev`.
  agentRules: false,
};

module.exports = withNextIntl(nextConfig);
