import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: this site has no API routes/middleware, so it can ship
  // as plain HTML/CSS/JS — works on Hostinger's shared hosting (just files
  // in public_html), not only on a Node.js/VPS plan that can run `next start`.
  output: "export",
  // Emit /cookie-policy/index.html instead of /cookie-policy.html. Plain
  // static hosts (Hostinger's Apache/LiteSpeed) don't map "/cookie-policy"
  // to a ".html" file — but a folder with an index.html always works, with
  // no rewrite rules needed. Without this, those pages 404 in production.
  trailingSlash: true,
  images: {
    // Next's built-in image optimizer needs a Node server; static export
    // has none, so images are served as-is.
    unoptimized: true,
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
