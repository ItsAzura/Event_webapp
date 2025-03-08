/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '7198',
        pathname: '/api/event/images/**',
      },
    ],
  },
};

export default nextConfig;
