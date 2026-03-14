"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import PayjpModal from "@/components/PayjpModal";

const PAYJP_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY ?? "";

const MEDICAL_CASES = [
  {
    icon: "😤",
    name: "暴言・威圧",
    examples: ["診察中の怒鳴り・暴言", "「殺すぞ」等の脅迫発言", "受付スタッフへの罵倒・机叩き"],
    pain: "録音・証拠化と毅然とした対応文が必要。",
  },
  {
    icon: "🕐",
    name: "過剰な要求・長時間拘束",
    examples: ["長時間の居座り・診察室占拠", "深夜救急の繰り返し利用", "「すぐ診ろ」の無理な要求"],
    pain: "境界線の設定と記録管理が重要。",
  },
  {
    icon: "⚠️",
    name: "医療過誤クレーム",
    examples: ["根拠なき医療ミス主張", "SNS拡散・口コミ投稿の脅迫", "「訴訟する」「弁護士に頼む」"],
    pain: "事実確認と記録が最重要。書面対応が有効。",
  },
  {
    icon: "💴",
    name: "クレジット拒否・未払い",
    examples: ["支払い拒否・値切り交渉", "「高すぎる」と会計で怒鳴る", "自費診療の後払い踏み倒し"],
    pain: "規程を明示した毅然対応と証拠確保が必要。",
  },
  {
    icon: "🚨",
    name: "スタッフへのセクハラ",
    examples: ["看護師へのセクハラ発言・接触", "「担当を替えろ」の繰り返し要求", "診察中の盗撮・録音"],
    pain: "即時対応と証拠保全。警察連携も視野に。",
  },
  {
    icon: "🏛",
    name: "行政・苦情申し立て",
    examples: ["市区町村への苦情申立", "国保連への申立て脅迫", "監査を匂わせる脅迫"],
    pain: "事実確認と適切な記録・報告が必要。",
  },
  {
    icon: "🏛",
    name: "行政・マスコミへの脅迫",
    examples: ["保健所・厚生局への通報脅迫", "マスコミ告発・テレビ出演の示唆", "「行政処分にしてやる」"],
    pain: "事実確認と適切な記録・報告が必要。",
  },
];

export default function IryouLP() {
  const [showPayjp, setShowPayjp] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"standard" | "business">("standard");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date("2026-10-01");
    const diff = Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    setDaysLeft(Math.max(0, diff));
  }, []);

  const openPayjp = (plan: "standard" | "business") => {
    setSelectedPlan(plan);
    setShowPayjp(true);
  };

  return (
    <main className="min-h-screen bg-white">
      {showPayjp && (
        <PayjpModal
          publicKey={PAYJP_PUBLIC_KEY}
          planLabel={selectedPlan === "business" ? "プロプラン ¥9,800/月（病院・医療法人向け）" : "クリニックプラン ¥9,800/月"}
          plan={selectedPlan}
          onSuccess={() => { setShowPayjp(false); window.location.href = "/success"; }}
          onClose={() => setShowPayjp(false)}
        />
      )}

      <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-center text-xs py-2.5 px-4 font-medium">
        ⚠️ 本サービスはAIによる参考情報の提供です。法的対応・患者対応については弁護士・医師賠償責任保険の担当者にご相談ください。正当なご意見・改善要望はクレームとは区別して丁寧に対応することを推奨しています。
      </div>

      <div className="bg-blue-700 text-white text-center text-sm font-semibold py-2.5 px-4">
        🚨 カスハラ対策義務化（2026年10月1日施行）まで{daysLeft !== null ? <strong> あと{daysLeft}日 </strong> : ""}— 医療機関も対象です
      </div>

      <nav className="border-b border-gray-100 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-bold text-gray-900">🏥 医療クレームAI</span>
          <Link
            href="/tool"
            className="bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            無料で試す（3回）
          </Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-6">
          クリニック・診療所・病院・医療法人 向け
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          患者・家族からのカスハラ。<br />
          <span className="text-blue-600">医療スタッフを守る対応文が15秒で作れます。</span>
        </h1>
        <p className="text-lg text-gray-500 mb-4 max-w-2xl mx-auto">
          暴言・医療過誤クレーム・セクハラ・深夜救急の乱用——医療現場特有のカスハラに特化したAIが、
          厚労省ガイドライン準拠の対応文・断り文・インシデントレポートを即生成します。
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
            <span className="text-blue-600 font-bold">医療特化</span>
            <span className="text-gray-600">医療用語・法令準拠</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
            <span className="text-blue-600 font-bold">証拠記録</span>
            <span className="text-gray-600">インシデントレポート生成</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
            <span className="text-blue-600 font-bold">運営基準対応</span>
            <span className="text-gray-600">2026年10月義務化に先行対応</span>
          </div>
        </div>
        <button
          onClick={() => openPayjp("standard")}
          className="inline-block bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 mb-3 transition-colors"
        >
          クリニックプランで始める ¥9,800/月 →
        </button>
        <p className="text-sm text-gray-500">登録不要・クレジットカード払い・いつでも解約可能</p>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-3">医療現場のカスハラは「特殊」です</h2>
          <p className="text-center text-gray-500 text-sm mb-10">一般企業向けのクレーム対応では対処できない、医療特有の問題があります</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {MEDICAL_CASES.map((c) => (
              <div key={c.name} className="border border-gray-200 rounded-xl p-5 bg-white">
                <div className="text-2xl mb-2">{c.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{c.name}</h3>
                <p className="text-xs text-blue-600 font-medium mb-3">{c.pain}</p>
                <ul className="space-y-1">
                  {c.examples.map((e) => (
                    <li key={e} className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="text-gray-300">▶</span>{e}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-3">医療クレームAIができること</h2>
          <p className="text-center text-gray-500 text-sm mb-10">医療・医事の法令・ガイドラインを踏まえた対応文を即生成</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                icon: "📝",
                title: "カスハラ対応文の即生成",
                desc: "状況・相手・深刻度を入力するだけ。厚労省ガイドライン準拠の毅然とした対応文が30秒で生成されます。医師・看護師・受付スタッフが実際に使える言葉遣いで出力。",
              },
              {
                icon: "📋",
                title: "インシデントレポート生成",
                desc: "日時・場所・発言内容・対応経緯を整理したインシデントレポートを自動生成。行政への報告や訴訟対応に備えた客観的な証拠記録ができます。",
              },
              {
                icon: "🛡",
                title: "不当要求の断り文",
                desc: "「根拠なき医療ミス主張」「規定外の要求」「支払い拒否」への明確な断り文。感情的にならず毅然と断れる書面・口頭両対応のスクリプトを生成。",
              },
              {
                icon: "📄",
                title: "書面通知文テンプレート",
                desc: "医療機関名義の公式文書として使える書面通知文を生成。警告・診療お断り・警察連携への言及を含む段階的対応文をそのまま活用できます。",
              },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-3">料金プラン</h2>
          <p className="text-center text-gray-500 text-sm mb-10">クリニック・病院の規模に合わせた2プラン</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-gray-200 rounded-2xl p-8 bg-white">
              <p className="text-gray-500 font-bold mb-2">スタータープラン</p>
              <p className="text-4xl font-black text-gray-900 mb-1">¥9,800<span className="text-base font-normal text-gray-500">/月</span></p>
              <p className="text-gray-400 text-sm mb-6">1事業所向け</p>
              <ul className="space-y-3 text-sm text-gray-700 mb-8">
                {["カスハラ対応文 月100件生成", "インシデントレポート生成", "医療特化プロンプト対応", "いつでも解約可能"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span>{f}</li>
                ))}
              </ul>
              <button
                onClick={() => setShowPayjp(true)}
                className="w-full border-2 border-blue-600 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors"
              >
                申し込む
              </button>
            </div>
            <div className="border-2 border-blue-600 rounded-2xl p-8 bg-blue-50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">複数事業所向け</div>
              <p className="text-blue-700 font-bold mb-2">プロプラン</p>
              <p className="text-4xl font-black text-gray-900 mb-1">要相談</p>
              <p className="text-gray-400 text-sm mb-6">複数事業所・法人一括契約</p>
              <ul className="space-y-3 text-sm text-gray-700 mb-8">
                {["スタータープラン全機能", "複数事業所の一括管理", "スタッフ研修用マニュアル生成", "優先サポート・訪問研修相談可"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span>{f}</li>
                ))}
              </ul>
              <a
                href="https://x.com/levona_design"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Xにてお問い合わせ →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-700 py-16 text-center px-6 text-white">
        <h2 className="text-2xl font-bold mb-3">医療スタッフを、カスハラから守りましょう</h2>
        <p className="text-blue-200 text-sm mb-8">15秒で対応文生成。毅然とした対応で医療機関とスタッフを守る。</p>
        <button
          onClick={() => setShowPayjp(true)}
          className="inline-block bg-white text-blue-700 font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-50 shadow-lg transition-colors"
        >
          クリニックプランで始める ¥9,800/月 →
        </button>
      </section>

      <footer className="border-t py-6 text-center text-xs text-gray-400">
        <div className="space-x-4 mb-2">
          <Link href="/legal" className="hover:underline">特定商取引法に基づく表記</Link>
          <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
        </div>
        <p>医療クレームAI — ポッコリラボ</p>
        <p className="mt-1 text-gray-300">本AIの出力は参考情報です。実際の対応は管理者・法的専門家にご相談ください。</p>
      </footer>
    </main>
  );
}
