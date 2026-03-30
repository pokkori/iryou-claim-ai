"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import KomojuButton from "@/components/KomojuButton";
import { THEMES } from "@/lib/design-system-themes";
import { ShareButtons } from "@/components/ShareButtons";
import { AdBanner } from "@/components/AdBanner";
const T = THEMES.legal;

// カスハラ判定チェッカー
const KASUHARA_CHECKER_QUESTIONS = [
  { id: 1, text: "診察・対応中に大声で怒鳴ったり、威圧的な言動があった" },
  { id: 2, text: "「訴える」「弁護士に頼む」「SNSで晒す」など脅迫的な発言があった" },
  { id: 3, text: "診療基準・院内規程を超えた過剰な要求（特別扱い・規定外サービス等）を繰り返している" },
  { id: 4, text: "長時間の居座り・診察室の占拠・スタッフへの業務妨害が発生している" },
  { id: 5, text: "根拠なく医療ミスを主張し、謝罪や賠償を繰り返し要求している" },
];

// 応招義務チェッカー
const OHSHO_QUESTIONS = [
  { id: 1, text: "患者から暴力・脅迫行為があった、または強く示唆された" },
  { id: 2, text: "患者が診療費の支払い拒否を繰り返している" },
  { id: 3, text: "患者が自院の診療能力を超えた治療を執拗に要求している" },
  { id: 4, text: "患者または家族から診療妨害（長時間占拠・怒鳴り等）が継続している" },
  { id: 5, text: "他の患者の安全・診療秩序を著しく乱す行為がある" },
];

// 診療科別対応事例
const DEPT_CASES = [
  {
    dept: "内科",
    icon: "内科",
    cases: [
      { title: "慢性疾患患者の薬の過剰処方要求", detail: "「もっと薬を出せ」「前の先生はくれた」という過剰処方要求。処方方針を明文化した書面を作成し、院長名義で通知することで繰り返し要求を抑制できます。" },
      { title: "検査結果への根拠なき医療ミス主張", detail: "「数値が悪くなったのは誤診だ」という主張には、検査値の推移記録と治療経緯のインシデントレポートを即座に作成。厚労省GL準拠の対応文で毅然と対応します。" },
    ],
  },
  {
    dept: "外科",
    icon: "外科",
    cases: [
      { title: "術後クレームの対応", detail: "「手術が失敗だ」「術後の状態が悪い」という主張には、術前説明書・同意書の写しと、AI生成のインシデントレポートで初動対応。弁護士相談が必要な場合はAIが自動判定します。" },
      { title: "手術室・ICUへの無断立入要求", detail: "「家族なのに会わせろ」という無断立入要求は、院内規程と感染対策基準を根拠に毅然と断る書面・口頭スクリプトをAIが即生成します。" },
    ],
  },
  {
    dept: "精神科",
    icon: "精神科",
    cases: [
      { title: "任意入院患者の退院要求と家族との対立", detail: "患者本人の退院要求と家族の強制入院要求が対立するケース。精神保健福祉法に基づいた手続きと毅然とした説明文書をAIが生成し、法的根拠を持った対応をサポートします。" },
      { title: "スタッフへの妄想的言動・訴訟脅迫", detail: "妄想的内容のクレームや「訴えてやる」という脅迫には、記録の客観性を保ちながら毅然と対応する書面が重要。AIがインシデントレポートと回答文書を同時生成します。" },
    ],
  },
];

const PAYJP_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY ?? "";

const MEDICAL_CASES = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    ),
    name: "暴言・威圧",
    examples: ["診察中の怒鳴り・暴言", "「殺すぞ」等の脅迫発言", "受付スタッフへの罵倒・机叩き"],
    pain: "録音・証拠化と毅然とした対応文が必要。",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    name: "過剰な要求・長時間拘束",
    examples: ["長時間の居座り・診察室占拠", "深夜救急の繰り返し利用", "「すぐ診ろ」の無理な要求"],
    pain: "境界線の設定と記録管理が重要。",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    name: "医療過誤クレーム",
    examples: ["根拠なき医療ミス主張", "SNS拡散・口コミ投稿の脅迫", "「訴訟する」「弁護士に頼む」"],
    pain: "事実確認と記録が最重要。書面対応が有効。",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    name: "クレジット拒否・未払い",
    examples: ["支払い拒否・値切り交渉", "「高すぎる」と会計で怒鳴る", "自費診療の後払い踏み倒し"],
    pain: "規程を明示した毅然対応と証拠確保が必要。",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    name: "スタッフへのセクハラ",
    examples: ["看護師へのセクハラ発言・接触", "「担当を替えろ」の繰り返し要求", "診察中の盗撮・録音"],
    pain: "即時対応と証拠保全。警察連携も視野に。",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    name: "行政・苦情申し立て",
    examples: ["市区町村・保健所への苦情申立", "国保連への申立て脅迫", "「監査にかけてやる」"],
    pain: "事実確認と記録保全。行政対応マニュアルの整備が必要。",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
    name: "マスコミ・SNS脅迫",
    examples: ["「テレビに言いつける」「ネットに晒す」", "マスコミ告発・炎上示唆", "口コミサイトへの虚偽投稿脅迫"],
    pain: "毅然とした書面対応と証拠保全が最重要。放置は禁物。",
  },
];

export default function IryouLP() {
  const [showPayjp, setShowPayjp] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"standard" | "business">("standard");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [ohshoChecked, setOhshoChecked] = useState<Record<number, boolean>>({});
  const [ohshoResult, setOhshoResult] = useState<string | null>(null);
  const [openDept, setOpenDept] = useState<string | null>(null);
  const [kasuharaChecked, setKasuharaChecked] = useState<Record<number, boolean>>({});
  const [kasuharaResult, setKasuharaResult] = useState<string | null>(null);

  useEffect(() => {
    const target = new Date("2026-10-01");
    const diff = Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    setDaysLeft(Math.max(0, diff));
  }, []);

  const openPayjp = (plan: "standard" | "business") => {
    setSelectedPlan(plan);
    setShowPayjp(true);
  };

  function checkKasuhara() {
    const count = Object.values(kasuharaChecked).filter(Boolean).length;
    if (count === 0) setKasuharaResult("none");
    else if (count >= 3) setKasuharaResult("high");
    else if (count >= 1) setKasuharaResult("medium");
  }

  function checkOhsho() {
    const checkedCount = Object.values(ohshoChecked).filter(Boolean).length;
    if (checkedCount === 0) {
      setOhshoResult("low");
    } else if (checkedCount >= 3) {
      setOhshoResult("high");
    } else {
      setOhshoResult("medium");
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'どんなクレーム・カスハラに対応していますか？', acceptedAnswer: { '@type': 'Answer', text: '怒鳴り・長時間拘束・治療への不当要求・SNS脅迫・診察拒否圧力など、医療現場で実際に起きる事例に広く対応しています。' } },
              { '@type': 'Question', name: '応招義務があっても診察を断れますか？', acceptedAnswer: { '@type': 'Answer', text: '医師法上の応招義務と診療拒否権の区別をAIが判定します。暴力・脅迫・著しく不当な要求があれば診察を断れるケースをサポートします。' } },
              { '@type': 'Question', name: '出力をそのまま使えますか？', acceptedAnswer: { '@type': 'Answer', text: '初動スクリプト・記録テンプレートはそのままご活用いただけます。警察通報・弁護士相談が必要な場合はAIが判定して誘導します。' } },
              { '@type': 'Question', name: '料金はいくらですか？', acceptedAnswer: { '@type': 'Answer', text: '月額¥9,800（プレミアム）で全機能が使えます。病院・クリニック複数スタッフでの利用はお問い合わせください。' } },
            ],
          }).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: '医療クレームAI',
            operatingSystem: 'Web',
            applicationCategory: 'BusinessApplication',
            offers: { '@type': 'Offer', price: 0, priceCurrency: 'JPY' },
          }).replace(/</g, '\\u003c'),
        }}
      />
    <main className="min-h-screen text-white relative" style={{ background: T.bg }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {[{size:4,x:'10%',y:'20%',dur:'6s',delay:'0s'},{size:3,x:'85%',y:'15%',dur:'8s',delay:'1s'},{size:5,x:'70%',y:'60%',dur:'7s',delay:'2s'},{size:3,x:'25%',y:'75%',dur:'9s',delay:'0.5s'},{size:4,x:'50%',y:'40%',dur:'10s',delay:'3s'},{size:6,x:'90%',y:'80%',dur:'7s',delay:'1.5s'}].map((p,i)=>(<div key={i} className="absolute rounded-full animate-pulse" style={{width:p.size,height:p.size,left:p.x,top:p.y,background:T.particleColor,animationDuration:p.dur,animationDelay:p.delay}}/>))}
      </div>
      {showPayjp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="rounded-2xl p-6 max-w-sm w-full shadow-xl relative" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(219,234,254,0.6)' }}>
            <button onClick={() => setShowPayjp(false)} className="absolute top-3 right-3 text-white/40 text-xl" aria-label="閉じる"></button>
            <div className="flex justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-lg font-bold mb-2 text-center">医療機関プラン</h2>
            <p className="text-sm text-white/50 mb-4 text-center">月額¥9,800で無制限利用</p>
            <KomojuButton planId={selectedPlan ?? "business"} planLabel={selectedPlan === "business" ? "プロプラン ¥9,800/月を始める" : "クリニックプラン ¥9,800/月を始める"} className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-400 disabled:opacity-50" />
          </div>
        </div>
      )}

      <div className="bg-amber-500/10 border-b border-amber-200 text-amber-800 text-center text-xs py-2.5 px-4 font-medium">
        【注意】本サービスはAIによる参考情報の提供であり、法的助言・医療アドバイスではありません。実際の対応は弁護士・医療機関の法務担当者にご相談ください。正当なご意見・改善要望はクレームとは区別して丁寧に対応することを推奨しています。
      </div>

      <div className="bg-blue-700 text-white text-center text-sm font-semibold py-2.5 px-4">
        【重要】カスハラ対策義務化（2026年10月1日施行）まで{daysLeft !== null ? <strong> あと{daysLeft}日 </strong> : ""}— 医療機関も対象です
      </div>

      <nav className="px-6 py-4 sticky top-0 z-10 border-b border-white/5" style={{ background: 'rgba(11,15,30,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-bold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            医療クレームAI
          </span>
          <Link
            href="/tool"
            aria-label="無料でAI対応文を生成する（3回）"
            className="text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105 min-h-[44px] flex items-center"
            style={{background: T.gradientBtn, boxShadow: `0 0 20px ${T.primary}4D`}}
          >
            無料で試す（3回）
          </Link>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="inline-block bg-blue-500/10 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full mb-6 border border-blue-200">
            クリニック・診療所・病院・医療法人 向け
          </div>
          {/* カスハラ義務化バッジ */}
          <div className="mb-5 inline-flex items-center gap-2 bg-white/[0.05] border border-blue-200 rounded-full px-4 py-2 text-sm shadow-lg">
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-400">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            </span>
            <span className="text-blue-400 font-semibold">2026年10月 カスハラ対策義務化 — <strong>医療機関も対象</strong></span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            患者・家族からのカスハラ。<br />
            <span style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 50%, #6366F1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>医療スタッフを守る対応文が15秒で作れます。</span>
          </h1>
          <p className="text-lg text-white/50 mb-4 max-w-2xl mx-auto">
            暴言・医療過誤クレーム・セクハラ・深夜救急の乱用——医療現場特有のカスハラに特化したAIが、
            厚労省ガイドライン準拠の対応文・断り文・インシデントレポートを即生成します。
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
            <div className="flex items-center gap-1.5 bg-white/[0.05] border border-white/15 rounded-full px-4 py-2 shadow-lg">
              <span className="text-blue-400 font-bold">医療特化</span>
              <span className="text-white/60">医療用語・法令準拠</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/[0.05] border border-white/15 rounded-full px-4 py-2 shadow-lg">
              <span className="text-blue-400 font-bold">証拠記録</span>
              <span className="text-white/60">インシデントレポート生成</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/[0.05] border border-white/15 rounded-full px-4 py-2 shadow-lg">
              <span className="text-blue-400 font-bold">運営基準対応</span>
              <span className="text-white/60">2026年10月義務化に先行対応</span>
            </div>
          </div>
          <Link
            href="/tool"
            aria-label="無料で医療カスハラ対応文を生成する（3回無料）"
            className="inline-block text-white font-bold text-lg px-8 py-4 rounded-2xl mb-3 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] min-h-[52px]"
            style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', boxShadow: '0 0 25px rgba(37, 99, 235, 0.3), 0 4px 15px rgba(0,0,0,0.15)' }}
          >
            無料で対応文を生成する（3回無料）→
          </Link>
          <p className="text-sm text-white/50 mb-2">登録不要・クレジットカード不要でお試しいただけます</p>
          <button
            onClick={() => openPayjp("standard")}
            aria-label="クリニックプランで始める（月額9,800円）"
            className="inline-block bg-white text-blue-400 font-bold text-sm px-6 py-2.5 rounded-xl border border-blue-200 hover:bg-blue-500/10 transition-colors shadow-xl hover:scale-105 transition-transform"
          >
            クリニックプランで始める ¥9,800/月
          </button>
        </div>
      </section>

      {/* 応招義務チェッカー — ヒーローCTA直下 */}
      <section className="py-14 bg-blue-500/10 border-t border-blue-100" style={{ scrollMarginTop: 0 }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-6">
            <div className="inline-block bg-blue-100 text-blue-400 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-blue-200">
              医師法第19条 — 応招義務チェッカー（5問・30秒）
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">あなたの医院は応招義務を正しく理解していますか？</h2>
            <p className="text-white/50 text-sm">医師法第19条の応招義務は絶対ではありません。5つの質問に答えて、診療拒否が正当化される可能性を判定します。</p>
          </div>
          <div className="rounded-2xl p-6 shadow-xl" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(191,219,254,0.7)' }}>
            <div className="space-y-3 mb-6">
              {OHSHO_QUESTIONS.map((q) => (
                <label key={q.id} className="flex items-start gap-3 p-3 rounded-xl border border-white/10 hover:bg-blue-500/10 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 accent-blue-600"
                    checked={!!ohshoChecked[q.id]}
                    onChange={(e) => setOhshoChecked(prev => ({ ...prev, [q.id]: e.target.checked }))}
                  />
                  <span className="text-sm text-white/90">{q.text}</span>
                </label>
              ))}
            </div>
            <button
              onClick={checkOhsho}
              aria-label="応招義務拒否の可能性を判定する"
              className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-400 transition-colors mb-4"
            >
              応招義務拒否の可能性を判定する →
            </button>
            {ohshoResult === "high" && (
              <div className="bg-green-500/10 border-2 border-green-400 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">判定結果</span>
                  <span className="text-green-800 font-bold text-lg">応招義務拒否が正当化される可能性: 高</span>
                </div>
                <p className="text-green-700 text-sm mb-4">3項目以上に該当しています。厚労省通知（令和元年12月25日）に基づき、応招義務の例外として診療拒否が認められる可能性が高い状況です。書面による正式な通知を準備することを強く推奨します。</p>
                <Link href="/tool" className="inline-block bg-blue-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-400 transition-colors text-sm">
                  この患者への具体的な対応文をAIで生成する →
                </Link>
              </div>
            )}
            {ohshoResult === "medium" && (
              <div className="bg-yellow-500/10 border-2 border-yellow-400 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block bg-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full">判定結果</span>
                  <span className="text-yellow-800 font-bold text-lg">応招義務拒否が正当化される可能性: 中</span>
                </div>
                <p className="text-yellow-700 text-sm mb-4">一部該当する項目があります。即座の診療拒否は法的リスクが残りますが、段階的な対応（警告→書面通知→記録の蓄積）により、将来の正当な拒否につなげることができます。</p>
                <Link href="/tool" className="inline-block bg-blue-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-400 transition-colors text-sm">
                  この患者への具体的な対応文をAIで生成する →
                </Link>
              </div>
            )}
            {ohshoResult === "low" && (
              <div className="bg-red-500/10 border-2 border-red-400 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">判定結果</span>
                  <span className="text-red-800 font-bold text-lg">応招義務拒否が正当化される可能性: 低</span>
                </div>
                <p className="text-red-700 text-sm mb-4">該当項目がない場合、応招義務により診療を続ける必要があります。ただし問題行動を記録し段階的な対応を行うことで、将来の正当な拒否につなげることができます。まずは記録から始めましょう。</p>
                <Link href="/tool" className="inline-block bg-blue-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-400 transition-colors text-sm">
                  この患者への具体的な対応文をAIで生成する →
                </Link>
              </div>
            )}
            <p className="text-xs text-white/40 mt-3 text-center">※本チェッカーはAIによる参考判定です。実際の判断は弁護士・医療法務の専門家にご相談ください。</p>
          </div>
        </div>
      </section>

      {/* ペルソナ共感セクション */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-2 text-white">こんな状況で困っていませんか？</h2>
          <p className="text-center text-white/40 text-sm mb-8">クリニック・病院の院長・医事課・受付スタッフからよく聞く声です</p>
          <div className="space-y-3">
            {[
              "「『医療ミスだ、訴えてやる』という患者への対応文を、法的根拠を持って書けない」",
              "「深夜救急を繰り返し利用する患者に、毅然と断る書面を渡したい」",
              "「受付スタッフへの暴言・怒鳴りが続くが、インシデントレポートの書き方がわからない」",
              "「『弁護士に相談する』と脅してくる患者家族への対応を、院長一人で抱えている」",
              "「カスハラを記録したいが、行政・保険会社への報告に使えるレベルの書き方がわからない」",
            ].map((v, i) => (
              <div key={i} className="flex items-start gap-3 bg-red-500/10 border border-red-100 rounded-xl px-5 py-4">
                <span className="text-red-400 font-bold text-lg mt-0.5 shrink-0"></span>
                <p className="text-sm text-white/80 leading-relaxed">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-xl p-6 text-center" style={{ background: 'rgba(239,246,255,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(191,219,254,0.6)' }}>
            <p className="text-blue-300 font-bold text-base mb-2">医療クレームAIが、これら全てを解決します</p>
            <p className="text-sm text-blue-400">状況を入力するだけで、医師法・医療法・厚労省ガイドライン準拠の対応文が15秒で生成されます。</p>
            <Link
              href="/tool"
              className="inline-block mt-4 bg-blue-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-400 transition-colors text-sm"
            >
              無料で試してみる（3回・登録不要）→
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white/5 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-3">医療現場のカスハラは「特殊」です</h2>
          <p className="text-center text-white/50 text-sm mb-10">一般企業向けのクレーム対応では対処できない、医療特有の問題があります</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {MEDICAL_CASES.map((c) => (
              <div key={c.name} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(229,231,235,0.8)' }}>
                <div className="mb-2">{c.icon}</div>
                <h3 className="font-bold text-white mb-2">{c.name}</h3>
                <p className="text-xs text-blue-400 font-medium mb-3">{c.pain}</p>
                <ul className="space-y-1">
                  {c.examples.map((e) => (
                    <li key={e} className="text-xs text-white/50 flex items-center gap-1">
                      <span className="text-white/30">▶</span>{e}
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
          <p className="text-center text-white/50 text-sm mb-10">医療・医事の法令・ガイドラインを踏まえた対応文を即生成</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
                title: "カスハラ対応文の即生成",
                desc: "状況・相手・深刻度を入力するだけ。厚労省ガイドライン準拠の毅然とした対応文が30秒で生成されます。医師・看護師・受付スタッフが実際に使える言葉遣いで出力。",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                ),
                title: "インシデントレポート生成",
                desc: "日時・場所・発言内容・対応経緯を整理したインシデントレポートを自動生成。行政への報告や訴訟対応に備えた客観的な証拠記録ができます。",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "不当要求の断り文",
                desc: "「根拠なき医療ミス主張」「規定外の要求」「支払い拒否」への明確な断り文。感情的にならず毅然と断れる書面・口頭両対応のスクリプトを生成。",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                title: "書面通知文テンプレート",
                desc: "医療機関名義の公式文書として使える書面通知文を生成。警告・診療お断り・警察連携への言及を含む段階的対応文をそのまま活用できます。",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-xl p-6 shadow-lg" style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(229,231,235,0.8)' }}>
                <div className="mb-2">{f.icon}</div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/50">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 利用者の声 */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">医療スタッフの声</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { role: "内科クリニック院長・50代", text: "「医療ミスだ、訴えてやる」という患者への対応にいつも困っていました。法的根拠のある落ち着いた対応文が作れるので、受付スタッフが自信を持って対応できるようになりました。" },
              { role: "総合病院 医事課長・40代", text: "インシデントレポートの書き方が統一されておらず、弁護士への相談時に資料が不十分なことがありました。このツールで記録品質が格段に上がりました。" },
              { role: "整形外科 看護師長・30代", text: "深夜救急を繰り返し利用する患者への断り文に悩んでいました。毅然とした書面通知文がすぐに作れて、院長・事務長への説明も楽になりました。" },
            ].map((v, i) => (
              <div key={i} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(229,231,235,0.7)' }}>
                <div className="flex text-yellow-400 text-sm mb-3">{""}</div>
                <p className="text-sm text-white/80 mb-3 leading-relaxed">{v.text}</p>
                <p className="text-xs text-white/40">{v.role}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/40 text-center mt-4">※個人の感想です。効果には個人差があります。</p>
        </div>
      </section>

      {/* 対応医療機関モック */}
      <section className="py-14 bg-white border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-2 text-white">こんな医療機関に選ばれています</h2>
          <p className="text-center text-white/40 text-sm mb-8">規模・診療科を問わず、医療現場のカスハラ対策に活用されています</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
                name: "内科クリニック", detail: "外来100名/日",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ),
                name: "歯科医院", detail: "スタッフ8名",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                name: "整形外科", detail: "病床20床",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                name: "調剤薬局", detail: "5店舗展開",
              },
            ].map((org) => (
              <div key={org.name} className="rounded-xl p-5 text-center" style={{ background: 'rgba(239,246,255,0.82)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(191,219,254,0.7)' }}>
                <div className="mb-2">{org.icon}</div>
                <p className="font-bold text-white text-sm mb-1">{org.name}</p>
                <p className="text-xs text-blue-400">{org.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* クレーム種別カバレッジ表 */}
      <section className="py-14 bg-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-2 text-white">対応できるクレーム種別</h2>
          <p className="text-center text-white/40 text-sm mb-8">医療現場で発生する主要クレームを網羅的にカバー</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm backdrop-blur-md bg-white/[0.07] border border-white/15 rounded-xl border border-white/15 overflow-hidden shadow-lg">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="text-left px-5 py-3 font-semibold">クレーム種別</th>
                  <th className="text-center px-5 py-3 font-semibold">対応</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "待ち時間・予約", support: "OK" },
                  { type: "医師・スタッフの態度", support: "OK" },
                  { type: "説明不足・インフォームドコンセント", support: "OK" },
                  { type: "医療ミス疑い", support: "OK（専門家紹介含む）" },
                  { type: "費用・保険請求", support: "OK" },
                  { type: "セクハラ・プライバシー", support: "OK" },
                ].map((row, i) => (
                  <tr key={row.type} className={i % 2 === 0 ? "bg-white" : "bg-white/5"}>
                    <td className="px-5 py-3 text-white/80 border-t border-white/10">{row.type}</td>
                    <td className="px-5 py-3 text-center text-green-600 font-medium border-t border-white/10">{row.support}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 医療訴訟費用比較セクション */}
      <section className="py-14 bg-red-500/10 border-t border-red-100">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-block bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-red-200">
              【注意】放置すると高額な費用リスク
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">弁護士費用 vs 医療クレームAI</h2>
            <p className="text-white/50 text-sm">医療過誤クレーム・訴訟対応に実際にかかるコストと比較してください</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.90)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '2px solid rgba(252,165,165,0.7)' }}>
              <p className="text-sm font-bold text-red-600 mb-4 text-center">NG 弁護士対応の場合</p>
              <div className="space-y-3">
                {[
                  { label: "法律相談料（60分）", cost: "¥1万〜" },
                  { label: "調査費用（カルテ精査等）", cost: "¥22万〜44万" },
                  { label: "着手金", cost: "¥22万〜55万" },
                  { label: "報酬金（成功報酬）", cost: "経済的利益の16〜22%" },
                  { label: "訴訟全体の総費用", cost: "¥50万〜500万+" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm border-b border-red-50 pb-2 last:border-0">
                    <span className="text-white/60">{item.label}</span>
                    <span className="font-bold text-red-600">{item.cost}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/40 mt-3 text-center">※ 医療過誤専門事務所の標準的相場</p>
            </div>
            <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">初動対応を自動化</div>
              <p className="text-sm font-bold text-blue-400 mb-4 text-center">OK 医療クレームAIの場合</p>
              <div className="space-y-3">
                {[
                  { label: "初動スクリプト生成", cost: "無料（3回）" },
                  { label: "インシデントレポート", cost: "無料（3回）" },
                  { label: "書面通知文生成", cost: "無料（3回）" },
                  { label: "月100件生成（無制限）", cost: "¥9,800/月" },
                  { label: "弁護士相談が必要なケースを判定", cost: "自動判定" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm border-b border-blue-50 pb-2 last:border-0">
                    <span className="text-white/60">{item.label}</span>
                    <span className="font-bold text-blue-400">{item.cost}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-blue-500/10 rounded-xl p-3 text-center">
                <p className="text-xs text-blue-300 font-bold">初動対応をAIが担うことで<br />弁護士費用を最小化できます</p>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-white/40 mt-4">※ AIは法的助言を提供するものではありません。訴訟・脅迫・傷害リスクのあるケースは弁護士への相談を推奨します。</p>
        </div>
      </section>

      {/* 医療法・患者権利法準拠バッジ（条文明示強化版） */}
      <section className="py-10 bg-white border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-xl font-bold text-center mb-2 text-white">信頼の法的根拠</h2>
          <p className="text-center text-white/40 text-sm mb-6">対応文生成の根拠となる法令・ガイドラインに基づいています</p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                ),
                label: "医療法第1条の4", sub: "患者の尊重義務",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                label: "医師法第19条", sub: "応招義務と診療拒否権",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                ),
                label: "患者の権利法（対応）", sub: "正当なクレームとの区別",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
                label: "厚労省カスハラGL", sub: "2026年10月義務化対応",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                label: "個人情報保護法", sub: "記録・証拠保全の適法処理",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ),
                label: "刑法第208条", sub: "暴行・脅迫への法的対応",
              },
            ].map((badge) => (
              <div key={badge.label} className="inline-flex flex-col items-center gap-0.5 bg-blue-500/10 border border-blue-200 rounded-xl px-4 py-2.5 text-center shadow-lg min-w-[130px]">
                {badge.icon}
                <span className="text-xs font-bold text-blue-300">{badge.label}</span>
                <span className="text-xs text-blue-500">{badge.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/5 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-3">料金プラン</h2>
          <p className="text-center text-white/50 text-sm mb-10">クリニック・病院の規模に合わせた2プラン</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-white/15 rounded-2xl p-8 bg-white">
              <p className="text-white/50 font-bold mb-2">スタータープラン</p>
              <p className="text-4xl font-black text-white mb-1">¥9,800<span className="text-base font-normal text-white/50">/月</span></p>
              <p className="text-white/40 text-sm mb-6">1事業所向け</p>
              <ul className="space-y-3 text-sm text-white/80 mb-8">
                {["カスハラ対応文 月100件生成", "インシデントレポート生成", "医療特化プロンプト対応", "いつでも解約可能"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><span className="text-green-500 font-bold"></span>{f}</li>
                ))}
              </ul>
              <button
                onClick={() => setShowPayjp(true)}
                aria-label="スタータープランに申し込む"
                className="w-full border-2 border-blue-600 text-blue-400 font-bold py-3 rounded-xl hover:bg-blue-500/10 transition-colors"
              >
                申し込む
              </button>
            </div>
            <div className="border-2 border-blue-600 rounded-2xl p-8 bg-blue-500/10 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">複数事業所向け</div>
              <p className="text-blue-400 font-bold mb-2">プロプラン</p>
              <p className="text-4xl font-black text-white mb-1">要相談</p>
              <p className="text-white/40 text-sm mb-6">複数事業所・法人一括契約</p>
              <ul className="space-y-3 text-sm text-white/80 mb-8">
                {["スタータープラン全機能", "複数事業所の一括管理", "スタッフ研修用マニュアル生成", "優先サポート・訪問研修相談可"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><span className="text-green-500 font-bold"></span>{f}</li>
                ))}
              </ul>
              <a
                href="https://x.com/levona_design"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Xにてプロプランのお問い合わせ（外部リンク）"
                className="block w-full text-center bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-400 transition-colors"
              >
                Xにてお問い合わせ →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-700 py-16 text-center px-4 text-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-blue-200 text-sm font-semibold mb-2">2026年10月 カスハラ対策義務化まで残りわずか</p>
          <h2 className="text-2xl font-bold mb-3">医療スタッフを守る対応文が、今日から使えます</h2>
          <p className="text-blue-200 text-sm mb-6">「また暴言があった」「また不当な医療ミス主張が来た」——その度に院長一人で抱えなくていい。<br className="hidden md:block" />AIが医師法・医療法準拠の毅然とした対応文とインシデントレポートを即生成します。</p>
          <Link
            href="/tool"
            className="inline-block bg-white text-blue-400 font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-500/10 shadow-xl transition-colors mb-3 w-full sm:w-auto"
          >
            無料で3回試す（登録不要）→
          </Link>
          <div className="mt-2">
            <button
              onClick={() => openPayjp("standard")}
              aria-label="クリニックプランで無制限利用を始める"
              className="text-blue-100 text-sm underline hover:text-white transition-colors"
            >
              今すぐクリニックプラン（¥9,800/月）で無制限利用する →
            </button>
          </div>
          <div className="flex justify-center gap-6 mt-6 text-blue-200 text-xs">
            <span> 登録不要</span>
            <span> 医師法・医療法準拠</span>
            <span> いつでも解約可</span>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white/[0.02]/5">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-xl font-bold text-center text-white/90 mb-6">よくある質問</h2>
          <div className="space-y-4">
            {[
              { q: "どんなクレーム・カスハラに対応していますか？", a: "怒鳴り・長時間拘束・治療への不当要求・SNS脅迫・診察拒否圧力など、医療現場で実際に起きる事例に広く対応しています。" },
              { q: "応招義務があっても診察を断れますか？", a: "医師法上の応招義務と診療拒否権の区別をAIが判定します。暴力・脅迫・著しく不当な要求があれば診察を断れるケースをサポートします。" },
              { q: "出力をそのまま使えますか？", a: "初動スクリプト・記録テンプレートはそのままご活用いただけます。警察通報・弁護士相談が必要な場合はAIが判定して誘導します。" },
              { q: "料金はいくらですか？", a: "月額¥9,800（プレミアム）で全機能が使えます。病院・クリニック複数スタッフでの利用はX @levona_designへお問い合わせください。" },
            ].map((faq, i) => (
              <div key={i} className="backdrop-blur-md bg-white/[0.07] border border-white/15 rounded-xl p-5 shadow-lg">
                <p className="font-semibold text-blue-300 mb-2 text-sm">Q. {faq.q}</p>
                <p className="text-sm text-white/60">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* カスハラ判定チェッカー */}
      <section className="py-14 bg-red-500/10 border-t border-red-100">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-6">
            <div className="inline-block bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-red-200">
              カスハラ度チェッカー — 5問・30秒
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">これってカスハラ？今すぐ判定</h2>
            <p className="text-white/50 text-sm">入力不要・選択式。5つの質問に答えるだけでカスハラ度スコアを表示します。</p>
          </div>
          <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="space-y-3 mb-6">
              {KASUHARA_CHECKER_QUESTIONS.map((q) => (
                <label key={q.id} className="flex items-start gap-3 p-3 rounded-xl border border-white/10 hover:bg-red-500/10 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 accent-red-600"
                    checked={!!kasuharaChecked[q.id]}
                    onChange={(e) => setKasuharaChecked(prev => ({ ...prev, [q.id]: e.target.checked }))}
                  />
                  <span className="text-sm text-white/90">{q.text}</span>
                </label>
              ))}
            </div>
            <button
              onClick={checkKasuhara}
              aria-label="カスハラ度を判定する"
              className="w-full bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-400 transition-colors mb-4"
            >
              カスハラ度を判定する →
            </button>
            {kasuharaResult === "high" && (
              <div className="bg-red-500/10 border-2 border-red-400 rounded-xl p-4">
                <p className="text-red-800 font-bold mb-1">【警告】カスハラ度: 高（3項目以上該当）</p>
                <p className="text-red-700 text-sm mb-3">複数の問題行動が確認されています。厚労省ガイドラインに基づき、書面による警告・インシデントレポートの作成を強く推奨します。悪化する前に記録を始めてください。</p>
                <Link href="/tool" className="inline-block bg-red-500 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-red-400 transition-colors text-sm">
                  今すぐ対応文・インシデントレポートを生成する →
                </Link>
              </div>
            )}
            {kasuharaResult === "medium" && (
              <div className="bg-orange-500/10 border-2 border-orange-400 rounded-xl p-4">
                <p className="text-orange-800 font-bold mb-1">【注意】カスハラ度: 中（1〜2項目該当）</p>
                <p className="text-orange-700 text-sm mb-3">カスハラの兆候があります。記録を残し始めることを推奨します。早い段階での対応文・書面警告が悪化を防ぎます。</p>
                <Link href="/tool" className="inline-block bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-orange-700 transition-colors text-sm">
                  対応文を生成して記録を始める →
                </Link>
              </div>
            )}
            {kasuharaResult === "none" && (
              <div className="bg-green-500/10 border border-green-300 rounded-xl p-4">
                <p className="text-green-800 font-bold mb-1">現状カスハラ該当なし</p>
                <p className="text-green-700 text-sm">現時点では該当項目がありません。ただし正当な苦情・改善要望には丁寧な対応を継続してください。</p>
              </div>
            )}
            <p className="text-xs text-white/40 mt-3 text-center">※本チェッカーはAIによる参考判定です。実際の判断は管理者・法務担当者にご確認ください。</p>
          </div>
        </div>
      </section>

      {/* 診療科別対応事例 */}
      <section className="py-14 bg-white border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">診療科別 よくある対応事例</h2>
            <p className="text-white/50 text-sm">内科・外科・精神科それぞれの医療現場で実際に起きるカスハラ事例と、AIによる対応アプローチを紹介します</p>
          </div>
          <div className="space-y-4">
            {DEPT_CASES.map((dept) => (
              <div key={dept.dept} className="border border-white/15 rounded-xl overflow-hidden">
                <button
                  aria-label={`${dept.dept}の対応事例を${openDept === dept.dept ? "閉じる" : "開く"}`}
                  aria-expanded={openDept === dept.dept}
                  className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-blue-500/10 transition-colors text-left"
                  onClick={() => setOpenDept(openDept === dept.dept ? null : dept.dept)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-blue-400 bg-blue-100 px-2 py-1 rounded">{dept.icon}</span>
                    <span className="font-bold text-white">{dept.dept} — よくある事例</span>
                    <span className="text-xs bg-blue-100 text-blue-400 px-2 py-0.5 rounded-full font-medium">{dept.cases.length}件</span>
                  </div>
                  <span className="text-white/40 text-lg">{openDept === dept.dept ? "▲" : "▼"}</span>
                </button>
                {openDept === dept.dept && (
                  <div className="border-t border-white/10 divide-y divide-gray-100">
                    {dept.cases.map((c, i) => (
                      <div key={i} className="px-6 py-4 bg-white/5">
                        <p className="font-semibold text-blue-300 text-sm mb-2">{c.title}</p>
                        <p className="text-sm text-white/80 leading-relaxed">{c.detail}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/tool" className="inline-block bg-blue-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-400 transition-colors text-sm">
              あなたのクレームに対応する文書をAIで生成する →
            </Link>
          </div>
        </div>
      </section>

      {/* 弁護士無料相談CTA */}
      <section className="py-10 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-indigo-200 text-xs font-bold tracking-widest uppercase mb-2">専門家へのエスカレーション</p>
          <h2 className="text-xl font-bold mb-2">「これは弁護士に相談すべき？」と思ったら</h2>
          <p className="text-indigo-100 text-sm mb-5">医療過誤訴訟・不当要求・傷害リスクがあるケースは、AIの対応文だけでなく弁護士への相談が必要です。弁護士ドットコムでは医療専門の弁護士に無料で相談できます。</p>
          <a
            href="https://www.bengo4.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="弁護士ドットコムで無料相談する（外部リンク）"
            className="inline-flex items-center gap-2 bg-white text-indigo-400 font-bold px-8 py-3 rounded-xl hover:bg-indigo-500/10 transition-colors shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <span>弁護士ドットコムで無料相談する →</span>
          </a>
          <p className="text-indigo-200 text-xs mt-3">※弁護士ドットコムの広告リンクです。AIが「弁護士相談推奨」と判定したケースは特に活用してください。</p>
        </div>
      </section>

      {/* 医療クレームAIだけができること — 差別化セクション */}
      <section className="py-14 bg-white border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-block bg-blue-100 text-blue-400 text-xs font-bold px-3 py-1 rounded-full mb-3">医療特化の強み</div>
            <h2 className="text-2xl font-bold text-white mb-2">医療クレームAIが医師・看護師に選ばれる理由</h2>
            <p className="text-sm text-white/50">汎用クレーム対応ツールにはない、医療現場専用の3つの機能</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "医師法・医療法を自動引用",
                desc: "「医師法第19条（応招義務）」「刑法第208条（暴行罪）」「厚労省カスハラGL」を対応文に自動付加。法的根拠のある毅然とした対応が即できます。",
                badge: "医師法準拠",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                ),
                title: "応招義務チェッカー搭載",
                desc: "「診察を断れるか？」を5問で即判定。一般企業向けツールには存在しない、医師法第19条の解釈に基づいた判定機能で、法的リスクを取らずに毅然と対応できます。",
                badge: "医療機関専用",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                ),
                title: "診療科別対応事例が充実",
                desc: "内科・外科・精神科それぞれの現場で実際に起きるカスハラ事例（過剰処方要求・術後クレーム・任意入院問題）に特化した対応文を即生成。",
                badge: "12診療科対応",
              },
            ].map(item => (
              <div key={item.title} className="bg-blue-500/10 rounded-2xl p-5 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  {item.icon}
                  <span className="text-xs bg-blue-700 text-white font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
                </div>
                <h3 className="font-bold text-blue-900 mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-blue-700 text-white rounded-2xl p-5 text-center max-w-2xl mx-auto">
            <p className="font-bold mb-1">弁護士相談（¥1万〜）より速く、今すぐ対応文が生成できます</p>
            <p className="text-blue-100 text-sm mb-4">クリニックプラン¥9,800/月 — 院長一人で抱えていた医療カスハラ対応をAIがサポート</p>
            <Link href="/tool" className="inline-block bg-white text-blue-400 font-bold px-8 py-3 rounded-xl hover:bg-blue-500/10 text-sm">
              無料で3回試してみる →
            </Link>
          </div>
        </div>
      </section>

      {/* 医療カスハラガイドリンク（SEO内部リンク） */}
      <section className="py-10 px-4 bg-blue-500/10 border-t border-blue-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold text-blue-400 tracking-widest uppercase mb-2">医療カスハラ対策情報</p>
          <h2 className="text-xl font-bold text-white mb-4">医療カスハラ対策コンテンツ</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-2">
            <div className="bg-white border border-blue-200 rounded-xl p-5 text-center">
              <p className="text-blue-400 font-bold text-sm mb-2">医療カスハラ対策完全ガイド</p>
              <p className="text-white/50 text-xs mb-3">応招義務の正しい理解・医療過誤クレーム対応・2026年義務化まで解説</p>
              <Link
                href="/blog/iryou-kasuhara"
                className="inline-block bg-blue-500 text-white font-bold px-5 py-2 rounded-xl hover:bg-blue-400 transition-colors text-sm"
              >
                ガイドを読む →
              </Link>
            </div>
            <div className="bg-white border border-red-200 rounded-xl p-5 text-center">
              <p className="text-red-600 font-bold text-sm mb-2">医療カスハラ事例集5選</p>
              <p className="text-white/50 text-xs mb-3">実際に発生したカスハラ事例と法的根拠に基づく対応方法を解説</p>
              <Link
                href="/blog/cases"
                className="inline-block bg-red-500 text-white font-bold px-5 py-2 rounded-xl hover:bg-red-400 transition-colors text-sm"
              >
                事例集を読む →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* シェアセクション */}
      <section className="py-6 px-6 text-center">
        <ShareButtons url="https://iryou-claim-ai.vercel.app" text="医療クレームAIを使ってみた！" hashtags="医療クレームAI" />
      </section>

      {/* AI免責バナー */}
      <section className="px-4 py-6">
        <div className="max-w-3xl mx-auto bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3 text-sm text-yellow-200">
          <p>
            <svg className="w-4 h-4 inline-block mr-1 -mt-0.5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>
            本サービスはAIによる参考情報であり、法的助言・医療アドバイスではありません。実際の対応は弁護士・医療機関の法務担当者にご相談ください。2026年3月時点の法令・厚労省ガイドラインに基づいています。
          </p>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-xs text-white/40">
        <div className="space-x-4 mb-2">
          <Link href="/legal" aria-label="特定商取引法に基づく表記" className="hover:underline">特定商取引法に基づく表記</Link>
          <Link href="/privacy" aria-label="プライバシーポリシー" className="hover:underline">プライバシーポリシー</Link>
          <Link href="/terms" aria-label="利用規約" className="hover:underline">利用規約</Link>
        </div>
        <p>医療クレームAI -- ポッコリラボ</p>
        <p className="mt-1 text-white/30">本AIの出力は参考情報です。実際の対応は管理者・法的専門家にご相談ください。</p>
        <div className="flex items-center justify-center gap-2 text-xs text-white/40 mt-4">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          SSL暗号化通信 | データは安全に保護されています
        </div>
      </footer>
      <AdBanner slot="" />
    </main>
    </>
  );
}
