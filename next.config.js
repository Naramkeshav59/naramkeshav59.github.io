/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // GitHub Pages only serves static files, so build the whole site to /out.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}
module.exports = nextConfig
