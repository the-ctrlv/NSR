import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content";

// Required for `output: "export"` — metadata routes must opt into static
// generation explicitly there.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
