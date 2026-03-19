import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "医療現場のカスハラ対策完全ガイド2026年【クリニック・病院向け】 | 医療クレームAI",
  description: "医療機関向けカスタマーハラスメント（カスハラ）対策ガイド。暴言・医療過誤クレーム・セクハラ・応招義務の解説。2026年10月義務化に向けた対応方法を徹底解説。",
  openGraph: {
    title: "医療現場のカスハラ対策完全ガイド2026年",
    description: "クリニック・病院が今すぐ取り組むべきカスハラ対策を医師法・医療法に基づき解説",
  },
};

const MEDICAL_KASUHARA_TYPES = [
  {
    type: "暴言・脅迫",
    icon: "😤",
    examples: ["「殺すぞ」等の脅迫発言", "受付での怒鳴り・罵倒", "SNS炎上を匂わせる発言"],
    law: "刑法第222条（脅迫罪）・第208条（暴行罪）",
    response: "記録・警察連絡・書面通知が有効",
  },
  {
    type: "医療過誤クレーム（根拠なし）",
    icon: "⚠️",
    examples: ["根拠なき医療ミス主張", "「弁護士に相談する」の繰り返し", "カルテ開示要求と虚偽主張"],
    law: "名誉毀損罪・業務妨害罪",
    response: "事実確認・記録・書面対応が最重要",
  },
  {
    type: "過剰要求・長時間拘束",
    icon: "🕐",
    examples: ["診察後の2時間以上の居座り", "深夜救急の繰り返し利用", "規定外処置の強要"],
    law: "不退去罪・業務妨害罪",
    response: "応招義務の範囲確認・書面通知",
  },
  {
    type: "スタッフへのセクハラ",
    icon: "🚨",
    examples: ["看護師への性的発言・接触", "盗撮・無断録音", "「担当を替えろ」の繰り返し"],
    law: "強制わいせつ罪・不正競争防止法",
    response: "複数体制・警察連携・契約解除予告",
  },
  {
    type: "行政・マスコミへの脅迫",
    icon: "📺",
    examples: ["「保健所・厚労省に言う」", "「テレビに告発する」", "口コミサイトへの虚偽投稿脅迫"],
    law: "名誉毀損罪・業務妨害罪",
    response: "証拠保全・毅然とした書面対応",
  },
];

const OSHAKU_GUIDE = [
  {
    q: "そもそも応招義務とは何ですか？",
    a: "医師法第19条第1項に規定される、医師が診療を求められた場合に正当な理由なく拒むことができない義務です。ただし「正当な理由」がある場合は診察を断ることができます。",
  },
  {
    q: "診察を断れる「正当な理由」とは？",
    a: "厚労省の通知（令和元年）では、①診療時間外・診療能力外、②患者からの暴力・脅迫、③信頼関係が著しく損なわれた場合、④他院への紹介が適切な場合、が正当な理由として示されています。",
  },
  {
    q: "暴力を振るう患者を断れますか？",
    a: "はい、断れます。患者・家族からの暴力・脅迫行為は「正当な理由」に該当します。ただし断る場合は書面で通知し、緊急性がある場合は他院への紹介を行うことが推奨されます。",
  },
  {
    q: "深夜救急の繰り返し利用を断れますか？",
    a: "軽症にもかかわらず繰り返し救急を利用し、真に緊急な患者の診療を妨げる場合は制限できる可能性があります。書面で連絡方法を指定し、事前に記録を残しておくことが重要です。",
  },
];

const CASE_EXAMPLES = [
  {
    title: "ケース1: 「医療ミスだ、訴えてやる」への対応",
    situation: "治療結果に不満を持つ患者家族が「医療ミスだ、弁護士に頼む、ネットに晒す」と外来で怒鳴り続け、受付スタッフが精神的に追い詰められた。",
    response: "AIでインシデントレポートと「医療ミス主張への書面対応文」を生成。事実確認の上、「根拠のない医療ミス主張への対応方針」を書面で送付。",
    result: "書面送付後、家族の言動が落ち着いた。第三者委員会への説明資料にもインシデントレポートを活用。",
    docType: "医療過誤クレーム対応通知書",
  },
  {
    title: "ケース2: 深夜救急の繰り返し利用",
    situation: "同一患者が週3〜4回、軽症で深夜救急を利用。「すぐ診ろ」「入院させろ」と要求し、緊急患者の対応が遅れる事態が続いた。",
    response: "AIで「救急受診ガイドライン通知書」と「繰り返し受診への受診制限通知書」を生成。家族と面談の上書面を渡した。",
    result: "書面交付後、緊急でない受診が激減。スタッフの疲弊も改善。「応招義務の範囲」を書面で明示したことが効果的だった。",
    docType: "救急受診制限通知書",
  },
  {
    title: "ケース3: スタッフへのセクハラ対応",
    situation: "入院患者から担当看護師への性的発言が複数回発生。「一人で来い」「担当を固定しろ」と要求し、看護師が恐怖を感じていた。",
    response: "AIで「複数体制への切り替え通知書」と「再発時の診療お断り予告通知書」を生成。患者家族に書面送付。",
    result: "書面交付後は問題が発生しなくなった。複数体制の導入と書面の組み合わせが有効だった。",
    docType: "セクハラ対応・複数体制通知書",
  },
];

export default function IryouKasuharaPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-center text-xs py-2 px-4">
        ⚠️ 本サービスはAIによる参考情報の提供です。法的助言ではありません。実際の対応は弁護士・医療機関法務担当者にご相談ください。
      </div>

      <nav className="border-b border-gray-100 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-gray-900">🏥 医療クレームAI</Link>
          <Link href="/tool" className="bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            無料で試す（3回）
          </Link>
        </div>
      </nav>

      {/* パンくずリスト */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 text-xs text-gray-500">
        <nav aria-label="breadcrumb">
          <ol className="flex items-center gap-1 max-w-4xl mx-auto">
            <li><Link href="/" className="hover:text-blue-700">トップ</Link></li>
            <li>/</li>
            <li className="text-gray-700 font-medium">医療カスハラ対策完全ガイド</li>
          </ol>
        </nav>
      </div>

      {/* ヒーロー */}
      <section className="bg-gradient-to-br from-blue-700 to-indigo-600 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
            2026年10月 医療機関も義務化対象
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-4">医療現場のカスハラ対策<br />完全ガイド2026年版</h1>
          <p className="text-blue-100 text-base mb-4">クリニック・病院・調剤薬局向け。暴言・医療過誤クレーム・セクハラ・応招義務まで、医療特有のカスハラ対策を医師法・医療法に基づき解説。</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-white/20 rounded-full px-3 py-1">医師法・医療法準拠</span>
            <span className="bg-white/20 rounded-full px-3 py-1">応招義務解説付き</span>
            <span className="bg-white/20 rounded-full px-3 py-1">2026年10月義務化</span>
          </div>
        </div>
      </section>

      {/* 目次 */}
      <section className="py-8 px-4 bg-blue-50 border-b border-blue-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-bold text-blue-800 text-sm mb-3">📋 このガイドで分かること</h2>
          <ol className="space-y-1 text-sm text-blue-700">
            {[
              "医療カスハラの定義と一般企業との違い",
              "医療現場に多い5種類のカスハラと法的対応",
              "応招義務の正しい理解（断れるケースとは）",
              "医療現場のカスハラ対応成功事例3選",
              "医療クレームAIを使った対応文書の作り方",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 第1章: 定義 */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 医療カスハラとは何か</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
            <p className="text-blue-800 font-bold text-sm mb-2">【定義】医療分野のカスハラ</p>
            <p className="text-blue-700 text-sm leading-relaxed">
              医療機関における患者・家族からのカスタマーハラスメントとは、医療スタッフの就業環境を著しく害する行為です。暴言・暴力・過剰要求・脅迫のほか、「応招義務を盾にした不当要求」「医療ミスと虚偽主張による脅迫」など医療特有の形態があります。
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-amber-800 text-sm font-bold mb-1">✅ 正当な苦情との区別が重要</p>
            <p className="text-amber-700 text-sm">待ち時間への不満・治療方針への疑問・スタッフの態度への苦情は「正当なフィードバック」として受け止めるべきです。一方で、脅迫・暴言・過剰要求はカスハラとして毅然と対応することが求められます。</p>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            日本医師会の調査では、医療機関の約80%がカスハラ・理不尽なクレームを経験。特にコロナ禍以降、「ワクチンを打つな」「マスクを外せ」などの特殊要求も増加しています。医療スタッフの離職率上昇の主要因の一つとなっており、組織的対応が不可欠です。
          </p>
        </div>
      </section>

      {/* 第2章: 種類と法的対応 */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">2. 医療現場のカスハラ5種類と法的対応</h2>
          <div className="space-y-4">
            {MEDICAL_KASUHARA_TYPES.map((k, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-blue-50 border-b border-blue-100 px-5 py-3 flex items-center gap-3">
                  <span className="text-2xl">{k.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{k.type}</h3>
                    <p className="text-xs text-blue-600">{k.law}</p>
                  </div>
                </div>
                <div className="p-5 grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-600 mb-2">具体的な行為例</p>
                    <ul className="space-y-1">
                      {k.examples.map((e, j) => (
                        <li key={j} className="text-xs text-gray-600 flex items-start gap-1">
                          <span className="text-gray-400">▶</span>{e}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-bold text-blue-700 mb-1">推奨対応</p>
                    <p className="text-xs text-blue-600">{k.response}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 第3章: 応招義務ガイド */}
      <section className="py-12 px-4 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">3. 応招義務の正しい理解</h2>
          <p className="text-gray-500 text-sm mb-6">医師法第19条「応招義務」について、よくある誤解を解説します。</p>
          <div className="bg-blue-900 text-white rounded-xl p-5 mb-6">
            <p className="text-blue-200 text-xs font-bold mb-1">医師法第19条第1項</p>
            <p className="text-white text-sm font-semibold leading-relaxed">「診療に従事する医師は、診察治療の求があった場合には、正当な理由がなければ、これを拒んではならない。」</p>
          </div>
          <div className="space-y-4">
            {OSHAKU_GUIDE.map((item, i) => (
              <div key={i} className="border border-blue-100 rounded-xl overflow-hidden">
                <div className="bg-blue-50 px-5 py-3">
                  <h3 className="font-bold text-blue-800 text-sm">Q. {item.q}</h3>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm text-gray-700 leading-relaxed">A. {item.a}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            <p className="font-bold mb-1">💡 AIが応招義務の範囲を判定します</p>
            <p className="text-blue-700 text-xs">医療クレームAIは、ケースごとに「応招義務の適用範囲」を判定し、診察を断れるかどうかの目安と対応文書を生成します。</p>
          </div>
        </div>
      </section>

      {/* 第4章: 成功事例 */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">4. 医療現場のカスハラ対応成功事例</h2>
          <div className="space-y-6">
            {CASE_EXAMPLES.map((c, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                <div className="bg-blue-50 px-5 py-3 border-b border-blue-100">
                  <h3 className="font-bold text-gray-900 text-sm">{c.title}</h3>
                  <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">{c.docType}</span>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex gap-3">
                    <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded h-fit shrink-0">状況</span>
                    <p className="text-sm text-gray-700">{c.situation}</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded h-fit shrink-0">対応</span>
                    <p className="text-sm text-gray-700">{c.response}</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xs font-bold text-teal-600 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded h-fit shrink-0">結果</span>
                    <p className="text-sm text-gray-700">{c.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 第5章: AIツール活用 */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 医療クレームAIを使った対応文書の作り方</h2>
          <div className="space-y-4 mb-6">
            {[
              { step: 1, title: "診療科・部署・種別を選択", desc: "外来・救急・入院病棟、内科・外科・精神科など、医療特化の選択肢から選ぶだけ。" },
              { step: 2, title: "シナリオプリセットまたは手入力", desc: "外来・入院・急患・救急の3カテゴリ×5種類計15個のプリセットから選択可能。" },
              { step: 3, title: "深刻度を選択（軽度/中度/重度）", desc: "深刻度に応じて毅然さを調整した対応文を生成。警察連絡が必要なケースは自動判定。" },
              { step: 4, title: "3種類の文書が30秒で生成", desc: "口頭スクリプト・書面通知文・インシデントレポートが同時に生成され、すぐに使える。" },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 items-start bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{s.step}</div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{s.title}</h3>
                  <p className="text-gray-600 text-xs mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/tool" className="inline-block bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors">
              AIで医療クレーム対応文書を無料生成する →
            </Link>
            <p className="text-xs text-gray-400 mt-2">登録不要・クレジットカード不要・3回無料</p>
          </div>
        </div>
      </section>

      <section className="py-10 px-4 bg-blue-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-2">医療スタッフを守るカスハラ対応、今日から始めよう</h2>
          <p className="text-blue-100 text-sm mb-6">2026年10月の義務化まで待てません。AIが15秒で対応文書を生成します。</p>
          <Link href="/tool" className="inline-block bg-white text-blue-700 font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-50 shadow-lg transition-colors">
            無料で3回試す（登録不要）→
          </Link>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-xs text-gray-400">
        <div className="space-x-4 mb-2">
          <Link href="/legal" className="hover:underline">特定商取引法に基づく表記</Link>
          <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
          <Link href="/terms" className="hover:underline">利用規約</Link>
          <Link href="/" className="hover:underline">トップへ</Link>
        </div>
        <p>医療クレームAI — ポッコリラボ</p>
      </footer>
    </div>
  );
}
