/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "cms.edaperfumes.com", "images.remotePatterns"],
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/wc/:path*',
        destination: 'https://cms.edaperfumes.com/wp-json/wc/v3/:path*',
      },
    ];
  },
};

export default nextConfig;
