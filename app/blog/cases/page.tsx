import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "医療カスハラ事例集5選｜医療機関の実際の対応方法【2026年版】",
  description: "医療現場で実際に発生しているカスハラ事例5件を詳しく解説。暴言・医療過誤クレーム・セクハラ・深夜救急乱用など、厚労省ガイドライン準拠の対応方法を紹介します。",
  openGraph: {
    title: "医療カスハラ事例集5選｜医療機関の実際の対応方法",
    description: "医療現場で実際に発生しているカスハラ事例5件を詳しく解説。厚労省ガイドライン準拠の対応方法を紹介します。",
  },
};

const CASES = [
  {
    no: 1,
    title: "「医療ミスだ、訴えてやる」— 根拠なき医療過誤クレーム",
    category: "医療過誤クレーム",
    categoryColor: "bg-red-100 text-red-700",
    situation:
      "内科クリニックで定期受診中の患者が、血液検査の数値が先月より悪化したことを「医療ミスだ」と主張。診察中に大声で怒鳴り、「弁護士に相談して訴える」「口コミサイトに書き込む」と脅迫。院長が一人で対応を続けた結果、毎週同じ主張が繰り返される状況に。",
    response: [
      "検査値の経時変化記録と治療経緯をインシデントレポートとして即作成",
      "「数値の変化は治療の過失によるものではない」という医学的根拠を明記した書面通知を院長名義で送付",
      "「SNS投稿・口コミへの虚偽投稿は名誉毀損となる場合がある旨」を文書に明記",
      "繰り返す場合は弁護士への相談と受診制限を予告",
    ],
    result:
      "書面送付後、同様のクレームは減少。記録が蓄積されたことで、その後の対応も迷いなく実施できるようになった。",
    law: "医師法第19条・厚労省カスハラGL",
    icon: "!",
  },
  {
    no: 2,
    title: "深夜救急の繰り返し利用と「すぐ診ろ」要求",
    category: "過剰な要求",
    categoryColor: "bg-orange-100 text-orange-700",
    situation:
      "救急外来に週2〜3回深夜に来院。緊急性のない症状にもかかわらず「すぐ診ろ」「待てない」と怒鳴り続ける。スタッフが精神的に消耗し、夜間帯の勤務に支障が出始めた。",
    response: [
      "毎回の来院記録（日時・症状・対応内容）を詳細に記録",
      "「緊急性が認められない場合は診療の優先順位がある」ことを書面で通知",
      "「繰り返す深夜救急の不適切利用は、他の救急患者の命を危険にさらす」旨を明記した警告書を送付",
      "かかりつけ医への通院を強く勧める通知文を作成",
    ],
    result:
      "書面での通知後、深夜来院の頻度が大幅に減少。スタッフからも「対応の根拠ができた」と好評。",
    law: "医師法第19条（応招義務の例外）・厚労省令和元年12月25日通知",
    icon: "",
  },
  {
    no: 3,
    title: "看護師へのセクハラ発言・不適切な接触",
    category: "セクシャルハラスメント",
    categoryColor: "bg-pink-100 text-pink-700",
    situation:
      "整形外科リハビリ担当の看護師に対し、特定の患者が毎回「かわいいね」「手を繋ごう」などの発言を繰り返す。拒否すると「担当を替えろ」と要求。看護師が精神的に追い詰められ、担当変更を申し出た。",
    response: [
      "発言内容・日時・状況を複数スタッフの証言を含めて記録",
      "「スタッフへのセクシャルハラスメントは当院の方針に反する」旨を患者本人に書面で通知",
      "「再発した場合は診療お断りの対象とする」ことを文書に明記",
      "複数スタッフでの対応体制に切り替え",
    ],
    result:
      "書面通知後、問題発言が停止。看護師の精神的負担も軽減。院内でセクハラ対応マニュアルを整備するきっかけになった。",
    law: "刑法第176条（不同意わいせつ）・男女雇用機会均等法",
    icon: "",
  },
  {
    no: 4,
    title: "SNSへの虚偽投稿脅迫",
    category: "マスコミ・SNS脅迫",
    categoryColor: "bg-purple-100 text-purple-700",
    situation:
      "待ち時間が長かったことに腹を立てた患者が「Googleマップに最悪の評価を書く」「SNSで院名を晒す」と受付で大声で宣言。その後、事実と異なる内容のネガティブレビューを実際に投稿した。",
    response: [
      "発言の日時・内容・証人をインシデントレポートに記録",
      "「虚偽の事実を摘示した口コミは名誉毀損罪・偽計業務妨害罪に該当する可能性がある」旨を書面で通知",
      "投稿内容の事実確認と反論文の準備（必要に応じてGoogleへの削除申請）",
      "弁護士への相談を検討",
    ],
    result:
      "書面送付後、患者から連絡があり投稿を削除。法的リスクを明示した書面が抑止力になった。",
    law: "刑法第230条（名誉毀損）・刑法第233条（偽計業務妨害）",
    icon: "",
  },
  {
    no: 5,
    title: "「俺を優先しろ」— 繰り返す特別扱い要求",
    category: "不当要求",
    categoryColor: "bg-amber-100 text-amber-700",
    situation:
      "地域の有力者を自称する患者が、毎回「予約なしで優先診察」を要求。断ると「院長を出せ」「この病院を潰してやる」と受付スタッフに怒鳴り続ける。受付スタッフが対応に疲弊し、退職を検討する事態に。",
    response: [
      "「予約制の診療方針は全患者に平等に適用される」ことを明記した書面を院長名義で送付",
      "「脅迫的な言動は業務妨害・脅迫罪に該当する場合がある」旨を通知",
      "繰り返す場合は警察への相談・受診お断りの対象となる旨を予告",
      "スタッフへの対応マニュアルを作成し、「一人で対応しない」体制を整備",
    ],
    result:
      "書面を受け取った後、患者の言動が落ち着いた。スタッフも「組織として守ってもらえる」という安心感を持てるようになった。",
    law: "刑法第222条（脅迫罪）・厚労省カスハラGL",
    icon: "",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "医療カスハラ事例集5選｜医療機関の実際の対応方法【2026年版】",
  description:
    "医療現場で実際に発生しているカスハラ事例5件を詳しく解説。厚労省ガイドライン準拠の対応方法を紹介します。",
  datePublished: "2026-03-20",
  dateModified: "2026-03-20",
  author: { "@type": "Organization", name: "医療クレームAI / ポッコリラボ" },
  publisher: { "@type": "Organization", name: "ポッコリラボ" },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://iryou-claim-ai.vercel.app/blog/cases",
  },
};

export default function MedicalCasesPage() {
  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="border-b border-gray-100 px-6 py-4 bg-white sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-gray-900">
             医療クレームAI
          </Link>
          <Link
            href="/tool"
            className="bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            無料で試す（3回）
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-14">
        <div className="mb-8 text-center">
          <div className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 border border-blue-200">
            医療カスハラ事例集
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            医療カスハラ事例集5選
            <br />
            <span className="text-blue-600">実際の対応方法と法的根拠</span>
          </h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            医療現場で実際に発生しているカスハラ事例と、厚労省ガイドライン・医師法・刑法に基づく対応方法を解説します。
            AIで対応文書を即生成することで、初動対応を大幅に効率化できます。
          </p>
          <p className="text-xs text-gray-400 mt-2">更新日: 2026年3月20日</p>
        </div>

        {/* パンくずリスト */}
        <nav className="text-xs text-gray-400 mb-8" aria-label="breadcrumb">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link href="/" className="hover:text-blue-600">トップ</Link></li>
            <li>/</li>
            <li><Link href="/blog/iryou-kasuhara" className="hover:text-blue-600">医療カスハラ対策ガイド</Link></li>
            <li>/</li>
            <li className="text-gray-600 font-medium">医療カスハラ事例集5選</li>
          </ol>
        </nav>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-10">
          <p className="text-blue-800 text-sm font-bold mb-1">この記事でわかること</p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>OK 医療現場で頻繁に発生するカスハラ5パターンの実例</li>
            <li>OK 各事例の法的根拠と具体的な対応ステップ</li>
            <li>OK 対応文書・インシデントレポートの活用方法</li>
          </ul>
        </div>

        <div className="space-y-10">
          {CASES.map((c) => (
            <article key={c.no} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-start gap-3">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.categoryColor}`}>
                    {c.category}
                  </span>
                  <h2 className="font-bold text-gray-900 text-lg mt-1">
                    事例{c.no}: {c.title}
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">状況</p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-red-50 border border-red-100 rounded-xl p-4">
                    {c.situation}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">対応ステップ</p>
                  <ol className="space-y-2">
                    {c.response.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-black shrink-0">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-green-700 mb-1">結果</p>
                  <p className="text-sm text-green-800 leading-relaxed">{c.result}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500">法的根拠:</span>
                  <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 font-medium">
                    {c.law}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 bg-blue-700 text-white rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold mb-3">
            あなたの状況に合った対応文を<br />AIが15秒で生成します
          </h2>
          <p className="text-blue-200 text-sm mb-6">
            上記の事例と同じような状況を入力するだけで、厚労省ガイドライン準拠の対応文・インシデントレポートを即生成。
            登録不要・カード不要で3回無料で試せます。
          </p>
          <Link
            href="/tool"
            className="inline-block bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-base shadow-lg"
          >
            無料で対応文を生成する（3回）→
          </Link>
          <p className="text-blue-300 text-xs mt-3">登録不要・クレジットカード不要</p>
        </div>

        {/* 弁護士相談CTA */}
        <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-xl p-6 text-center">
          <p className="text-xs font-bold text-indigo-700 mb-2">訴訟リスク・傷害リスクがある場合は専門家へ</p>
          <h3 className="text-base font-bold text-gray-900 mb-2">弁護士ドットコムで無料相談</h3>
          <p className="text-sm text-gray-600 mb-4">
            医療過誤訴訟・不当要求・脅迫など法的対応が必要なケースは弁護士への相談が有効です。
          </p>
          <a
            href="https://www.bengo4.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-800 transition-colors text-sm"
          >
             弁護士ドットコムで無料相談する →
          </a>
          <p className="text-xs text-gray-400 mt-2">※弁護士ドットコムの広告リンクです</p>
        </div>

        {/* 内部リンク */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/blog/iryou-kasuhara"
            className="flex-1 border border-blue-200 rounded-xl p-4 hover:bg-blue-50 transition-colors text-center"
          >
            <p className="text-xs text-blue-600 font-bold mb-1">関連記事</p>
            <p className="text-sm font-bold text-gray-900">医療カスハラ対策完全ガイド →</p>
          </Link>
          <Link
            href="/"
            className="flex-1 border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors text-center"
          >
            <p className="text-xs text-gray-400 font-bold mb-1">サービストップ</p>
            <p className="text-sm font-bold text-gray-900">医療クレームAI トップへ →</p>
          </Link>
        </div>
      </div>

      <footer className="border-t py-6 text-center text-xs text-gray-400 mt-10">
        <div className="space-x-4 mb-2">
          <Link href="/legal" className="hover:underline">特定商取引法に基づく表記</Link>
          <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
          <Link href="/terms" className="hover:underline">利用規約</Link>
        </div>
        <p>医療クレームAI — ポッコリラボ</p>
        <p className="mt-1 text-gray-300">本記事の情報はAIによる参考情報です。実際の対応は管理者・法的専門家にご相談ください。</p>
      </footer>
    </main>
  );
}
