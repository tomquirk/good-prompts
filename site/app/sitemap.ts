import type { MetadataRoute } from "next";
import { getPrompts } from "@/lib/prompts";
import { absolute, lastUpdated, promptPath } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const prompts = getPrompts();
  return [
    { url: absolute("/"), lastModified: lastUpdated(prompts), changeFrequency: "weekly", priority: 1 },
    ...prompts.map((p) => ({
      url: absolute(promptPath(p.id)),
      lastModified: p.added_on,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
