import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/register"],
      disallow: ["/doctor/", "/patient/"],
    },
    sitemap: "https://cliniccare-omega.vercel.app/sitemap.xml",
  };
}
