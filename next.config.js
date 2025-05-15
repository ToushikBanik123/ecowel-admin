//  @type {import('next').NextConfig}
const nextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "*" }] },
  webpack(config, { isServer }) {
    if (isServer) {
      config.module.rules.push({
        test: /\.(afm|z)$/,
        include: /pdfkit[\\/]js[\\/]data/,
        type: "asset/source",
      });
    }
    return config;
  },
  // redirects: async () => {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/en/auth/login",
  //       permanent: true,
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
