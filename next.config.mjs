/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // The curl-mode card renders by shelling out to card.sh/public/curl/*.sh
    // (execFileSync). Next's build-time file tracer only follows static
    // import/require, so it never discovers those files on its own — without
    // this, the deployed function is missing them (`card.sh: No such file`).
    outputFileTracingIncludes: {
      "/api/curl": ["card.sh", "public/curl/**"],
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
