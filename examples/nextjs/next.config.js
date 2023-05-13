const _getPublicEnv = (prefix) => {
  const envs = process.env;
  const res = {};

  Object.keys(envs).forEach((k) => {
    if (k.startsWith(prefix)) {
      res[k] = envs[k];
    }
  });

  return res;
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  publicRuntimeConfig: {
    ..._getPublicEnv('NEXT_PUBLIC_'),
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
