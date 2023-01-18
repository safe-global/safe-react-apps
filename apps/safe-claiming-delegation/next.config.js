const packageJson = require('./package.json')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    dirs: ['pages', 'scripts', 'src'],
  },
  // Served from folder on Safe Apps domain
  // Note: may cause issues as DApp requiring dynamic basePath in runtime
  basePath:
    // Note: duplicate of `constants.ts.IS_PRODUCTION`, but cannot import TS files without workaround
    process.env.NEXT_PUBLIC_IS_PRODUCTION !== 'false' || process.env.NODE_ENV === 'production'
      ? packageJson.homepage
      : undefined,
  assetPrefix: './',
  // `Image` not supported in static export
  images: {
    unoptimized: true,
  },
  experimental: {
    modularizeImports: {
      '@mui/material': {
        transform: '@mui/material/{{member}}',
      },
      '@mui/icons-material/?(((\\w*)?/?)*)': {
        transform: '@mui/icons-material/{{ matches.[1] }}/{{member}}',
      },
      'date-fns': {
        transform: 'date-fns/{{member}}',
      },
    },
  },
  // Safe cannot access manifest.json otherwise
  headers: async () => {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            prettier: false,
            svgo: false,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: { removeViewBox: false },
                  },
                },
              ],
            },
            titleProp: true,
          },
        },
      ],
    })

    return config
  },
}

module.exports = nextConfig
