/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  // The React Compiler runs Babel over every file, which makes `next dev` noticeably slower.
  // Keep it for production builds only.
  reactCompiler: process.env.NODE_ENV === "production",

  experimental: {
    // Only pull in the icons/helpers that are actually used instead of whole barrel files.
    optimizePackageImports: [
      "lucide-react",
      "react-icons/fa",
      "date-fns",
      "recharts",
      "@base-ui/react",
    ],
  },
};

export default nextConfig;
