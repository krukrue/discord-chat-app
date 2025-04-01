import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'gxskjlliyelsmtimftrh.supabase.co'], // Add the external domain
  },
};

export default nextConfig;
