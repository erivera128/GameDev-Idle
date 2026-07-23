import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  // Standalone output copies a dependency tree using symlinks on Windows. It is
  // only needed by the production container, where the Linux build supports it.
  output: process.env.DOCKER_BUILD === '1' ? 'standalone' : undefined,
};
export default nextConfig;
