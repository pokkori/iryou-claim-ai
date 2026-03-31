import { MetadataRoute } from "next";

const KEYWORD_SLUGS = [
  "iryou-medical-claim-houhou",
  "kanja-monku-taio-manual",
  "iryou-jimu-custharass",
  "doctor-patient-trouble",
  "kango-staff-harassment",
  "iryou-medical-malpractice-claim",
  "byoin-complaint-system",
  "iryou-claim-kiroku-houhou",
  "chiryou-setsumeifusoku-claim",
  "iryou-claim-horitsu-chishiki",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://iryou-claim-ai.vercel.app";
  const keywordEntries: MetadataRoute.Sitemap = KEYWORD_SLUGS.map((slug) => ({
    url: `${base}/keywords/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/tool`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/blog/iryou-kasuhara`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ...keywordEntries,
    { url: `${base}/legal`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];
}
