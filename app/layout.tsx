import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE_URL = "https://iryou-claim-ai.vercel.app";
const TITLE = "医療クレームAI｜患者・家族からのカスハラ対応文を30秒で生成｜クリニック・病院向け";
const DESC = "患者・家族からの暴言・過剰要求・医療過誤クレームに。改正労働施策総合推進法（2026年10月義務化）準拠の対応文・断り文・証拠記録テンプレートをAIが即生成。クリニック向け¥4,980/月。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏥</text></svg>" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE_URL,
    siteName: "医療クレームAI",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
  },
  metadataBase: new URL(SITE_URL),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "医療クレームAI",
      "url": SITE_URL,
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "AggregateOffer",
        "offerCount": "2",
        "offers": [
          { "@type": "Offer", "price": "4980", "priceCurrency": "JPY", "description": "スタンダードプラン（クリニック向け）¥4,980/月" },
          { "@type": "Offer", "price": "9800", "priceCurrency": "JPY", "description": "プロプラン（病院・医療法人向け）¥9,800/月" }
        ]
      },
      "description": DESC,
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "医療現場のカスハラに特化していますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。厚生労働省「医療現場のハラスメント対策ガイドライン」に準拠した、クリニック・病院特有のカスハラ対応文を生成します。" } },
        { "@type": "Question", "name": "証拠記録テンプレートも生成されますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。日時・場所・発言内容・対応経緯を整理したインシデントレポートを生成します。行政への報告や訴訟対応に備えた証拠管理にご活用ください。" } },
        { "@type": "Question", "name": "2026年10月のカスハラ義務化に対応していますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。改正労働施策総合推進法による2026年10月のカスハラ体制整備義務化に先行対応しています。" } },
        { "@type": "Question", "name": "解約はいつでもできますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい、いつでも解約可能です。解約後は次の更新日まで引き続きご利用いただけます。" } },
      ],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
