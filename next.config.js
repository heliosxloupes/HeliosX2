/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self'",
              "connect-src 'self' https://api.stripe.com https://www.google-analytics.com https://analytics.google.com https://vitals.vercel-analytics.com https://*.supabase.co",
              "frame-src https://js.stripe.com https://hooks.stripe.com",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/medusa', destination: '/product/medusa', permanent: true },
      { source: '/apollo', destination: '/product/apollo', permanent: true },
      { source: '/galileo', destination: '/product/galileo', permanent: true },
      { source: '/newton', destination: '/product/newton', permanent: true },
      { source: '/kepler', destination: '/product/kepler', permanent: true },
    ]
  },
  webpack: (config, { isServer }) => {
    // Handle Three.js and React Three Fiber
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    
    // Handle canvas for Three.js - only externalize on server
    if (isServer) {
      config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    }
    
    // Optimize Three.js bundling
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: 'three',
            chunks: 'all',
          },
        },
      },
    };
    
    return config;
  },
}

module.exports = nextConfig

