/** @type {import('next').NextConfig} */
const nextConfig = {
//     experimental: {
// appDir: true
// },
images: {
     remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 👈 allow all domains
      },
      {
        protocol: 'http',
        hostname: '**', // 👈 also allow http if needed
      },
    ],
  },
};

export default nextConfig;
