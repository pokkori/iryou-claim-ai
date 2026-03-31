import { Metadata } from "next";

type KeywordData = {
  title: string;
  description: string;
  features: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
};

const KEYWORDS: Record<string, KeywordData> = {
  "iryou-medical-claim-houhou": {
    title: "医療クレーム対応の基本と手順",
    description: "医療クレームが発生した際の初期対応から解決までの手順をAIが支援。医師・看護師・事務スタッフの連携で迅速解決。",
    features: [
      { title: "初期対応の迅速化", body: "クレーム発生から30分以内の初期対応文をAIが即時生成します。" },
      { title: "事実確認と記録", body: "クレーム内容を構造化し、後の対応に使える記録書式で整理します。" },
      { title: "解決策の提案", body: "類似クレーム事例に基づく解決策をAIが複数パターン提示します。" },
    ],
    faqs: [
      { q: "医療クレーム対応で最初にすべきことは？", a: "まず患者・家族の話を傾聴し、共感を示すことが重要です。その後、事実確認と記録を行い、担当者間で情報共有します。" },
      { q: "クレーム対応にAIをどう活用しますか？", a: "AIはクレーム内容の分析、対応文書の下書き生成、類似事例の参照など、スタッフの業務負担を軽減します。" },
      { q: "医療クレームを防ぐ方法はありますか？", a: "患者への丁寧な説明、インフォームドコンセントの徹底、スタッフへのコミュニケーション研修が効果的です。" },
    ],
  },
  "kanja-monku-taio-manual": {
    title: "患者・家族のクレーム対応マニュアル",
    description: "患者や家族からのクレームに対し、医療機関スタッフが適切に対応するためのマニュアルをAIが作成・支援します。",
    features: [
      { title: "対応フロー自動生成", body: "クレームの種類・深刻度に応じた対応フローチャートをAIが作成します。" },
      { title: "謝罪文テンプレート", body: "状況に合わせたお詫び文・説明文のテンプレートを即時生成します。" },
      { title: "エスカレーション判断", body: "管理職・弁護士への相談が必要なケースをAIが自動判断します。" },
    ],
    faqs: [
      { q: "患者家族が激怒している場合の対応は？", a: "まず落ち着いた場所に移動し、感情を受け止めながら聴取します。即座に結論を出さず、調査後に回答することを伝えます。" },
      { q: "クレームマニュアルはどう整備すればよいですか？", a: "実際に発生したクレーム事例をもとに、対応手順・責任者・報告ルートを明確化したマニュアルを作成し、定期的に更新します。" },
      { q: "電話でのクレームと対面での対応の違いは？", a: "電話の場合は記録を取りながら聴取し、必要に応じて折り返しを提案します。対面は表情・態度も重要で、個室対応が基本です。" },
    ],
  },
  "iryou-jimu-custharass": {
    title: "医療事務のカスタマーハラスメント対策",
    description: "医療事務スタッフへの理不尽な要求・暴言・脅迫などカスタマーハラスメントへの対策をAIがサポートします。",
    features: [
      { title: "ハラスメント判定", body: "患者の言動がカスタマーハラスメントに該当するかAIが判定します。" },
      { title: "対応スクリプト生成", body: "毅然とした対応のためのスクリプトをシチュエーション別に生成します。" },
      { title: "記録・報告書作成", body: "ハラスメント事案の記録書・報告書をAIが自動作成します。" },
    ],
    faqs: [
      { q: "医療事務へのカスハラで多いのはどんなケースですか？", a: "待ち時間への不満による暴言、支払い拒否・値下げ要求、個人情報の過度な開示要求などが多く見られます。" },
      { q: "カスハラを受けた時の初期対応は？", a: "まず冷静に「その言動は業務の妨げになります」と伝え、改善されない場合は上司に引き継ぎます。一人で対応し続けないことが重要です。" },
      { q: "カスハラを記録する目的は何ですか？", a: "再発防止・改善策検討のほか、警察や弁護士への相談時の証拠として機能します。日時・内容・対応者を正確に記録します。" },
    ],
  },
  "doctor-patient-trouble": {
    title: "医師・患者間トラブルの解決法",
    description: "医師と患者の間で生じる誤解・不満・トラブルをAIが分析し、円滑な解決策を提示します。",
    features: [
      { title: "トラブル原因分析", body: "コミュニケーション不足・説明不足など、トラブルの根本原因をAIが特定します。" },
      { title: "仲介文書生成", body: "双方の立場を考慮した仲介・説明文書をAIが作成します。" },
      { title: "再発防止策提案", body: "同種トラブルを防ぐための院内改善策をAIが提案します。" },
    ],
    faqs: [
      { q: "医師への不満はどうやって伝えればよいですか？", a: "まず患者相談窓口や医療安全管理者に相談します。直接伝える場合は感情的にならず、具体的な事実を伝えることが効果的です。" },
      { q: "患者との信頼関係を回復する方法は？", a: "誠実な謝罪、十分な説明、改善策の提示が基本です。定期的なフォローアップで関係修復を図ります。" },
      { q: "セカンドオピニオンを求める患者への対応は？", a: "セカンドオピニオンは患者の権利として尊重し、必要な診療情報を提供します。拒否や妨害は患者の不信を招きます。" },
    ],
  },
  "kango-staff-harassment": {
    title: "看護師へのハラスメント対応ガイド",
    description: "看護師が受けるハラスメント（患者・医師・職場内）への対応方法をAIがサポート。メンタルヘルス保護も重視。",
    features: [
      { title: "ハラスメント種別判定", body: "患者・医師・職場からのハラスメントを種別ごとに判定し対応策を提示します。" },
      { title: "相談記録の作成", body: "ハラスメント事案を記録・相談する際の書式をAIが生成します。" },
      { title: "法的対応の案内", body: "深刻なケースでの法的手続き・相談先をAIがわかりやすく案内します。" },
    ],
    faqs: [
      { q: "患者から性的な言動を受けた場合の対応は？", a: "その場で明確に「不快です」と伝え、すぐに上司・師長に報告します。一人で対応せず複数対応体制を取ることが重要です。" },
      { q: "医師からのパワハラはどこに相談できますか？", a: "院内の相談窓口、医療安全管理者、人事部門、または外部の労働基準監督署や弁護士に相談できます。" },
      { q: "ハラスメントで精神的に辛い時の対処法は？", a: "まず信頼できる人に話を聞いてもらい、必要であれば産業医や医師に相談します。一人で抱え込まないことが大切です。" },
    ],
  },
  "iryou-medical-malpractice-claim": {
    title: "医療ミス・過失クレームの対処法",
    description: "医療過誤・ミスに関するクレームへの適切な対応方法をAIが支援。法的リスクを最小化しながら誠実に対応。",
    features: [
      { title: "事実関係の整理", body: "医療ミスに関する事実を時系列で整理し、対応の根拠を明確にします。" },
      { title: "謝罪文・説明文生成", body: "法的リスクを考慮した謝罪文・説明文をAIが慎重に作成します。" },
      { title: "法的対応の準備", body: "弁護士への相談に向けた資料整理・ポイント整理をAIがサポートします。" },
    ],
    faqs: [
      { q: "医療ミスが発覚した場合、まず何をすべきですか？", a: "患者・家族への速やかな報告と謝罪、事実関係の調査、管理職への報告を優先します。隠蔽は絶対にしてはいけません。" },
      { q: "医療過誤の示談交渉はどう進めますか？", a: "必ず医療専門の弁護士を通じて交渉します。医療機関の顧問弁護士がいる場合は早期に相談しましょう。" },
      { q: "医療事故と医療過誤の違いは何ですか？", a: "医療事故は結果として予期しない害が生じたケース、医療過誤はそこに過失（注意義務違反）がある場合です。過失の有無が法的責任の分岐点です。" },
    ],
  },
  "byoin-complaint-system": {
    title: "病院のクレーム受付・処理システム",
    description: "病院・クリニックのクレーム受付から処理・改善までの一連のシステム構築をAIが支援します。",
    features: [
      { title: "受付フォームの最適化", body: "クレーム内容を効率的に収集するフォーム・チェックリストをAIが作成します。" },
      { title: "対応状況の管理", body: "クレーム対応の進捗・担当者・完了状況を可視化して管理します。" },
      { title: "改善策の体系化", body: "クレームデータから傾向を分析し、院内改善策を体系的に提案します。" },
    ],
    faqs: [
      { q: "クレーム管理システムに必要な機能は何ですか？", a: "受付日時・内容・担当者・対応経緯・解決状況・再発防止策の記録機能が基本です。分析・レポート機能があると改善に役立ちます。" },
      { q: "クレーム情報はどのくらい保管すべきですか？", a: "医療機関では最低5年、訴訟リスクを考慮すると10年以上の保管が推奨されます。電子化して検索しやすくすることが重要です。" },
      { q: "クレーム対応の品質向上のための研修は？", a: "ロールプレイング、事例検討会、外部専門家による研修などが効果的です。年1回以上の実施が推奨されます。" },
    ],
  },
  "iryou-claim-kiroku-houhou": {
    title: "医療クレームの記録・報告書の書き方",
    description: "医療クレームの記録・報告書を正確かつ適切に作成する方法をAIが支援。法的にも有効な記録を効率的に作成。",
    features: [
      { title: "記録フォーマット提供", body: "医療クレーム記録に必要な項目を網羅したフォーマットをAIが提供します。" },
      { title: "報告書の自動生成", body: "クレーム内容を入力するだけで、整形された報告書をAIが自動生成します。" },
      { title: "法的に有効な表現", body: "後の法的手続きでも使えるよう、客観的で正確な表現をAIがアドバイスします。" },
    ],
    faqs: [
      { q: "医療クレームの記録で最も重要な項目は？", a: "発生日時・場所、クレーム内容（できるだけ本人の言葉で）、対応者、対応内容、患者の反応、次のアクションが必須項目です。" },
      { q: "記録の際に注意すべきことは？", a: "感情的な表現は避け、事実のみを客観的に記録します。推測や解釈は「〜と思われる」と明記し、記録者・日時を必ず入れます。" },
      { q: "電子記録と紙記録、どちらが良いですか？", a: "電子記録は検索・分析・共有に優れますが、改ざん防止措置が必要です。紙記録は証拠性が高いですが、紛失・劣化のリスクがあります。" },
    ],
  },
  "chiryou-setsumeifusoku-claim": {
    title: "治療説明不足クレームへの対応策",
    description: "「十分な説明がなかった」という患者クレームへの対応と、インフォームドコンセント強化策をAIが提案します。",
    features: [
      { title: "説明不足の原因分析", body: "クレーム内容からどの段階で説明が不足していたかをAIが分析します。" },
      { title: "補足説明文の生成", body: "不足していた説明を補うための文書・資料をAIが作成します。" },
      { title: "IC強化策の提案", body: "今後の説明不足を防ぐインフォームドコンセント改善策をAIが提案します。" },
    ],
    faqs: [
      { q: "インフォームドコンセントの基本要素は何ですか？", a: "病名・治療法・リスク・代替治療・同意の自由（断る権利）の5要素が基本です。患者が理解できる言葉で説明し、同意書に記録します。" },
      { q: "「聞いていない」というクレームへの対応は？", a: "説明記録・同意書を確認し、記録がある場合は丁寧に提示します。記録がない場合は謝罪し、改めて説明を行います。" },
      { q: "説明不足クレームを予防するには？", a: "説明チェックリストの活用、説明内容の録音（患者同意あり）、同意書の整備、複数スタッフによる確認が効果的です。" },
    ],
  },
  "iryou-claim-horitsu-chishiki": {
    title: "医療クレームに関する法律知識",
    description: "医療クレーム・訴訟・示談に関する基礎的な法律知識をわかりやすく解説。AIが適切な対応策を提示します。",
    features: [
      { title: "法的リスクの評価", body: "クレーム内容から法的リスクレベルをAIが評価し、対応優先度を判断します。" },
      { title: "関連法規の解説", body: "医療法・民法・刑法など関連する法律の要点をわかりやすくAIが解説します。" },
      { title: "専門家への相談準備", body: "弁護士・専門機関への相談を効果的に行うための資料整理をAIがサポートします。" },
    ],
    faqs: [
      { q: "医療クレームが訴訟に発展するケースは？", a: "医療過誤が認められる可能性がある場合、多額の損害賠償を求める場合、示談交渉が決裂した場合などです。弁護士への早期相談が重要です。" },
      { q: "医療機関が加入すべき保険はありますか？", a: "医師賠償責任保険（医師個人）、病院賠償責任保険（施設）への加入が推奨されます。カバー範囲を確認し適切な補償額を設定します。" },
      { q: "クレームを弁護士に相談するタイミングは？", a: "法的責任を問われる可能性がある場合、高額の賠償請求をされた場合、弁護士からの通知が届いた場合は速やかに相談します。" },
    ],
  },
};

const ALL_SLUGS = Object.keys(KEYWORDS);

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = KEYWORDS[slug];
  if (!data) return { title: "Not Found" };
  const BASE_URL = "https://iryou-claim-ai.vercel.app";
  return {
    title: `${data.title} | 医療クレームAI`,
    description: data.description,
    alternates: { canonical: `${BASE_URL}/keywords/${slug}` },
    openGraph: {
      title: `${data.title} | 医療クレームAI`,
      description: data.description,
      url: `${BASE_URL}/keywords/${slug}`,
      siteName: "医療クレームAI",
      type: "article",
      modifiedTime: "2026-03-31T00:00:00+09:00",
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title} | 医療クレームAI`,
      description: data.description,
    },
  };
}

export default async function KeywordPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = KEYWORDS[slug];
  if (!data) return <div>Not Found</div>;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    dateModified: "2026-03-31T00:00:00+09:00",
    mainEntity: data.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
            <p className="text-lg opacity-90 mb-8">{data.description}</p>
            <a
              href="/"
              className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition"
            >
              無料で試してみる
            </a>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-3xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">AIができること</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {data.features.map((f, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-6">
                <h3 className="font-bold text-blue-700 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">よくある質問</h2>
            <div className="space-y-6">
              {data.faqs.map((faq, i) => (
                <div key={i} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-bold text-gray-800 mb-2">Q. {faq.q}</h3>
                  <p className="text-gray-600">A. {faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">医療クレームAIを使ってみる</h2>
          <p className="mb-6 opacity-90">今すぐ無料で医療クレーム対応のAIサポートを体験できます。</p>
          <a
            href="/"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition"
          >
            無料で始める
          </a>
        </section>

        {/* Last Updated */}
        <p className="text-center text-xs text-gray-400 py-4">
          最終更新: 2026年3月31日
        </p>
      </main>
    </>
  );
}
