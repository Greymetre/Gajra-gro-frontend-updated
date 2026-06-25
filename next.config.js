const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL || 'http://187.127.186.131:4000/api'}/:path*`,
      },
    ]
  },
  publicRuntimeConfig: {
    staticFolder: '/static',
  },
  env: {
    API_URL: process.env.API_URL || 'http://187.127.186.131:4000/api',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://187.127.186.131:4000/api',
    IMAGE_URL: process.env.IMAGE_URL 
  },
}
module.exports = nextConfig
