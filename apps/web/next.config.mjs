/** @type {import('next').NextConfig} */
const nextConfig = {
  // Se precisar adicionar configurações depois, é aqui.
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"], // Importante para monorepos
};

export default nextConfig;