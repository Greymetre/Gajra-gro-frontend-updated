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
        destination: 'https://apis.fieldkonnect.io/api/:path*', 
      },
    ]
  },
  publicRuntimeConfig: {
    staticFolder: '/static',
  },
  env: {
    API_URL: process.env.API_URL ,
    IMAGE_URL: process.env.IMAGE_URL 
  },
}
module.exports = nextConfig
