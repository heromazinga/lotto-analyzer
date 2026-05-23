/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/**',
        'node_modules/@esbuild/**',
        'node_modules/webpack/**',
        'node_modules/sharp/**',
        'node_modules/terser/**',
        'node_modules/.cache/**',
      ],
    },
  },
};

export default nextConfig;
