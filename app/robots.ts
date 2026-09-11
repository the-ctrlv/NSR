import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content";

// Required for `output: "export"` — metadata routes must opt into static
// generation explicitly there.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
