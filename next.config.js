/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'source.unsplash.com', 'via.placeholder.com'],
  },
  serverExternalPackages: ['mongoose'],
}

module.exports = nextConfig
