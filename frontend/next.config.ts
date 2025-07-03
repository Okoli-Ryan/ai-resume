import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	serverExternalPackages: ["@react-pdf/renderer"],
	experimental: {
		esmExternals: "loose",
        serverActions: {
            bodySizeLimit: "2mb",
        }
	},
};

export default nextConfig;
