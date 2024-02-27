/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["images.pexels.com", "res.cloudinary.com", "picsum.photos"],
  },
};

module.exports = nextConfig;
