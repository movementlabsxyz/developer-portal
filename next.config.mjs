/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ['./src/sass'],
  },
  serverExternalPackages: ['remark-prism'],
}

export default nextConfig
