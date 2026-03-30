import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAdScript } from "@/components/GoogleAdScript";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});


const SITE_URL = "https://iryou-claim-ai.vercel.app";
const TITLE = "医療クレームAI｜患者・家族からのカスハラ対応文を15秒で生成｜クリニック・病院向け";
const DESC = "患者・家族からの暴言・過剰要求・医療過誤クレームに。改正労働施策総合推進法（2026年10月義務化）準拠の対応文・断り文・インシデントレポートをAIが即生成。クリニック向け¥9,800/月。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='1.5'><path stroke-linecap='round' stroke-linejoin='round' d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'/></svg>" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE_URL,
    siteName: "医療クレームAI",
    locale: "ja_JP",
    type: "website",
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: "医療クレームAI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: [`${SITE_URL}/og.png`],
  },
  metadataBase: new URL(SITE_URL),
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ホーム", "item": SITE_URL },
    { "@type": "ListItem", "position": 2, "name": "医療クレームAIツール", "item": `${SITE_URL}/tool` },
  ],
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
      "offers": { "@type": "Offer", "price": "9800", "priceCurrency": "JPY", "description": "クリニックプラン ¥9,800/月" },
      "description": DESC,
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "医療現場のカスハラに特化していますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。厚生労働省「医療現場のハラスメント対策ガイドライン」に準拠した、クリニック・病院特有のカスハラ対応文を生成します。" } },
        { "@type": "Question", "name": "証拠記録テンプレートも生成されますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。日時・場所・発言内容・対応経緯を整理したインシデントレポートを生成します。行政への報告や訴訟対応に備えた証拠管理にご活用ください。" } },
        { "@type": "Question", "name": "2026年10月のカスハラ義務化に対応していますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。改正労働施策総合推進法による2026年10月のカスハラ体制整備義務化に先行対応しています。" } },
        { "@type": "Question", "name": "解約はいつでもできますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい、いつでも解約可能です。解約後は次の更新日まで引き続きご利用いただけます。" } },
        { "@type": "Question", "name": "医師法第19条の応招義務があっても診察を断れますか？", "acceptedAnswer": { "@type": "Answer", "text": "医師法第19条の応招義務は絶対ではありません。厚生労働省通知（令和元年12月25日）によれば、患者からの暴力・脅迫行為、著しく不当な要求、他患者の診療を著しく妨害する行為がある場合は、応招義務の例外として診療拒否が認められる可能性があります。医療クレームAIの応招義務チェッカーで5問に答えるだけで、診療拒否の可否をAIが判定します。" } },
        { "@type": "Question", "name": "医療過誤クレームへの対応はどうすればいいですか？", "acceptedAnswer": { "@type": "Answer", "text": "「医療ミスだ、訴えてやる」という患者への対応は、事実の冷静な確認と記録が最重要です。医療クレームAIは、医師法・医療法・民法709条（不法行為）に基づいた、感情的にならず毅然とした初動対応文・インシデントレポートを即生成します。弁護士相談が必要なケースは自動判定して弁護士ドットコムへ誘導します。" } },
        { "@type": "Question", "name": "診療科別の対応事例はありますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。内科・外科・精神科それぞれの医療現場で実際に起きるカスハラ事例と、AIによる対応アプローチを紹介しています。内科の過剰処方要求、外科の術後クレーム、精神科の任意入院問題など、診療科特有の複雑なケースに対応しています。" } },
        { "@type": "Question", "name": "受付スタッフへの暴言・怒鳴りへの対応は？", "acceptedAnswer": { "@type": "Answer", "text": "受付スタッフへの暴言・怒鳴り・威圧的言動は、刑法第208条（暴行罪）・第222条（脅迫罪）に該当する可能性があります。医療クレームAIは「カスハラ判定チェッカー（5問）」で深刻度を自動判定し、毅然とした口頭スクリプト・インシデントレポート・書面警告文を同時生成します。" } },
        { "@type": "Question", "name": "医療クレームAIと弁護士相談の違いは何ですか？", "acceptedAnswer": { "@type": "Answer", "text": "弁護士相談は法律の専門家による個別判断ですが、相談料¥1万〜・予約が必要・対応まで数日かかるデメリットがあります。医療クレームAIは月¥9,800で初動対応文・インシデントレポート・判断基準を15秒で生成でき、弁護士相談が必要なケースを自動判定して誘導します。初動AIで対処し、深刻なケースのみ弁護士へという使い分けが最適です。" } },
        { "@type": "Question", "name": "深夜救急の繰り返し利用患者への対応方法は？", "acceptedAnswer": { "@type": "Answer", "text": "深夜救急の繰り返し利用は「医療資源の不当な占有」として、応招義務の例外事由に該当する可能性があります。医療クレームAIは「書面による利用制限通知」「本来の救急医療の趣旨を説明した案内文」「地域の適切な医療機関への誘導文書」を即生成します。医師法第19条の解釈を踏まえた適法な対応を支援します。" } },
        { "@type": "Question", "name": "患者からのSNS投稿・口コミ脅迫への対応は？", "acceptedAnswer": { "@type": "Answer", "text": "「ネットに晒す」「口コミに書く」といった脅迫は、刑事的には脅迫罪・恐喝罪に該当する可能性があります。医療クレームAIは「SNS脅迫への毅然とした書面対応文」「虚偽投稿があった場合の名誉毀損対応の初動スクリプト」「証拠保全チェックリスト」を生成します。感情的にならず、法的根拠を持って対応できます。" } },
      ],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`dark ${notoSansJP.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${notoSansJP.className} antialiased`}>
        {children}
        <Analytics />
        <GoogleAdScript />
      </body>
    </html>
  );
}
