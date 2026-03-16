import Link from "next/link";

const ITEMS = [
  { label: "販売業者", value: "ポッコリラボ" },
  { label: "運営責任者", value: "ポッコリラボ 代表 新美" },
  { label: "所在地", value: "非公開（請求があれば遅滞なく開示します）" },
  { label: "お問い合わせ", value: "X（Twitter）@levona_design へのDM" },
  { label: "販売価格", value: "クリニックプラン ¥9,800/月（税込）" },
  { label: "支払方法", value: "クレジットカード（PAY.JP（PAY.JP株式会社）経由）（Visa・Mastercard・American Express・JCB）" },
  { label: "支払時期", value: "お申込み時に即時決済。以降、毎月同日に自動更新" },
  { label: "サービス提供時期", value: "決済完了後、即時ご利用いただけます" },
  { label: "商品代金以外の必要料金", value: "なし" },
  { label: "返品・キャンセル", value: "デジタルコンテンツの性質上、決済完了後の返金は承っておりません。解約はいつでも可能です。解約後は次回更新日まで引き続きご利用いただけます" },
  { label: "動作環境", value: "インターネット接続環境および最新版ブラウザが必要です" },
];

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b px-6 py-4">
        <Link href="/" className="font-bold text-gray-900">医療クレームAI</Link>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">特定商取引法に基づく表記</h1>
        <p className="text-gray-500 text-sm mb-8">Act on Specified Commercial Transactions</p>
        <dl className="space-y-4">
          {ITEMS.map((item) => (
            <div key={item.label} className="border-b border-gray-100 pb-4">
              <dt className="text-sm font-semibold text-gray-500 mb-1">{item.label}</dt>
              <dd className="text-gray-800 text-sm leading-relaxed">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="text-base font-bold text-amber-900 mb-3">免責事項・法的制限について</h2>
          <ul className="space-y-3 text-sm text-amber-800 leading-relaxed list-disc list-inside">
            <li>
              本サービスはAIによる参考情報の提供を目的としており、<strong>法的助言・医療アドバイスには該当しません</strong>。
            </li>
            <li>
              本サービスは<strong>弁護士法第72条</strong>に基づき、法律事務（法的判断・交渉代行・訴訟指導等）を取り扱いません。法的な対応が必要な場合は弁護士にご相談ください。
            </li>
            <li>
              本サービスが生成する文書は<strong>医師法・医療法に基づく医療行為・医療指導</strong>を行うものではありません。患者への医療的判断・診断・治療指針については必ず医師にご相談ください。
            </li>
            <li>
              生成された対応文・インシデントレポートはあくまで参考文書です。実際にご使用の際は、医療機関の管理者・顧問弁護士・法務担当者が内容を確認・修正の上、責任をもってご使用ください。
            </li>
            <li>
              本サービスの利用により生じたいかなる損害についても、ポッコリラボは責任を負いません。
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
