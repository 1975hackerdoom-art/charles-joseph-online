const nextConfig = {
  devIndicators: false,
  ...(process.env.STATIC_EXPORT === 'true' ? {
    output: 'export',
    trailingSlash: true,
    basePath: process.env.STATIC_BASE_PATH || '',
    assetPrefix: process.env.STATIC_BASE_PATH ? `${process.env.STATIC_BASE_PATH}/` : undefined,
    images: { unoptimized: true },
  } : {}),
};
export default nextConfig;
