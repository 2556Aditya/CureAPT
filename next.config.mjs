// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      domains: ['i.pravatar.cc'],
    },
    webpack: (config) => {
      config.resolve.fallback = { fs: false };
      return config;
    }
  };
  
  // Use ES module export syntax instead of CommonJS
  export default nextConfig;