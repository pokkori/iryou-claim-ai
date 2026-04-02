"use client";

import { useState, useEffect, useRef } from "react";
import KomojuButton from "@/components/KomojuButton";
import { GlowButton } from "@/components/GlowButton";
import { track } from '@vercel/analytics';
import { updateStreak, loadStreak, getStreakMilestoneMessage, type StreakData } from "@/lib/streak";

const HISTORY_KEY = "iryou_history";
interface HistoryItem { text: string; date: string; }
function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]"); } catch { return []; }
}
function saveHistory(situation: string) {
  if (typeof window === "undefined") return;
  const items = loadHistory();
  items.unshift({ text: situation.slice(0, 50), date: new Date().toLocaleDateString("ja-JP") });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 5)));
}

function renderMarkdown(text: string): string {
  const lines = text.split("\n");
  const result: string[] = [];
  let inList = false;

  for (const line of lines) {
    if (/^## (.+)$/.test(line)) {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push(line.replace(/^## (.+)$/, '<h3 class="font-bold text-base mt-4 mb-2 text-cyan-700 border-b border-cyan-200 pb-1">$1</h3>'));
    } else if (/^# (.+)$/.test(line)) {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push(line.replace(/^# (.+)$/, '<h2 class="font-bold text-lg mt-4 mb-2 text-cyan-800">$1</h2>'));
    } else if (/^### (.+)$/.test(line)) {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push(line.replace(/^### (.+)$/, '<h4 class="font-semibold text-sm mt-3 mb-1 text-cyan-600">$1</h4>'));
    } else if (/^- (.+)$/.test(line)) {
      if (!inList) { result.push('<ul class="space-y-1 mb-2">'); inList = true; }
      const inner = line.replace(/^- /, "").replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
      result.push(`<li class="ml-4 list-disc text-gray-700 text-sm">${inner}</li>`);
    } else if (/^\d+\.\s/.test(line)) {
      if (!inList) { result.push('<ul class="space-y-1 mb-2">'); inList = true; }
      const inner = line.replace(/^\d+\.\s/, "").replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
      result.push(`<li class="ml-4 list-decimal text-gray-700 text-sm">${inner}</li>`);
    } else if (/^【.+】$/.test(line) || /^■/.test(line) || /^◆/.test(line)) {
      if (inList) { result.push("</ul>"); inList = false; }
      const inner = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
      result.push(`<p class="font-semibold text-cyan-700 text-sm mt-2 mb-1">${inner}</p>`);
    } else if (line.trim() === "") {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push('<div class="mt-2"></div>');
    } else {
      if (inList) { result.push("</ul>"); inList = false; }
      const inner = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
      result.push(`<p class="text-gray-700 text-sm leading-relaxed">${inner}</p>`);
    }
  }
  if (inList) result.push("</ul>");
  return result.join("\n");
}

const SECTION_TYPES = [
  { value: "外来", label: " 外来" },
  { value: "救急", label: " 救急" },
  { value: "入院病棟", label: "️ 入院病棟" },
  { value: "薬局", label: " 薬局" },
  { value: "検査", label: " 検査" },
];

const CLAIM_RECORD_TEMPLATE = `【発生日時】〇〇年〇〇月〇〇日
【患者・家族の訴え内容】
【担当スタッフ】
【経緯と対応状況】
【患者の要求内容】`;

const CASE_TYPES = [
  "暴言・威圧",
  "過剰な要求・長時間拘束",
  "医療過誤クレーム",
  "クレジット拒否・未払い",
  "スタッフへのセクハラ",
  "行政・マスコミへの脅迫",
];

const DEPARTMENT_TYPES = [
  { value: "", label: "診療科を選択（任意）" },
  { value: "内科", label: " 内科" },
  { value: "外科", label: " 外科" },
  { value: "精神科・心療内科", label: " 精神科・心療内科" },
  { value: "小児科", label: " 小児科" },
  { value: "産婦人科", label: " 産婦人科" },
  { value: "救急・救命", label: " 救急・救命" },
  { value: "整形外科", label: " 整形外科" },
  { value: "眼科・耳鼻科", label: "️ 眼科・耳鼻科" },
  { value: "歯科・口腔外科", label: " 歯科・口腔外科" },
  { value: "訪問診療・在宅医療", label: " 訪問診療・在宅医療" },
  { value: "介護施設・老人ホーム", label: " 介護施設・老人ホーム" },
];

const REQUESTER_TYPES = ["患者本人", "家族・親族", "その他"];
const SEVERITY_LEVELS = [
  { value: "軽度", label: " 軽度（一般的な苦情・要望）", score: 2, color: "bg-green-500" },
  { value: "中度", label: " 中度（度を超えた要求・繰り返し）", score: 5, color: "bg-yellow-400" },
  { value: "重度", label: " 重度（暴言・脅迫・不当要求）", score: 9, color: "bg-red-500" },
];

const TABS = [" 口頭スクリプト", " 書面通知文", " インシデント記録", " 院内掲示通知"] as const;
type TabLabel = typeof TABS[number];

const FREE_LIMIT = 3;
const STORAGE_KEY = "iryou_use_count";
const PAYJP_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY ?? "";

function parseResultToTabs(text: string): Record<TabLabel, string> {
  const parts = text.split(/^---$/m).map((s) => s.trim()).filter(Boolean);
  // 院内掲示通知は書面通知文から自動生成（掲示用に整形）
  const keijiText = parts[1] ? generateKeijiText(parts[1]) : "";
  return {
    " 口頭スクリプト": parts[0] || "",
    " 書面通知文": parts[1] || "",
    " インシデント記録": parts[2] || "",
    " 院内掲示通知": keijiText,
  };
}

function generateKeijiText(shomenText: string): string {
  return `# 院内掲示用 患者・ご家族へのお知らせ

当院では、医療スタッフが安全・安心に医療サービスを提供できる環境を守るため、以下の行為に対して毅然と対応いたします。

## 対応しかねる行為

- 医療スタッフへの暴言・怒鳴り・脅迫的発言
- 正当な理由のない診療・処置の強要
- スタッフへのセクシャルハラスメント
- 業務妨害にあたる長時間の居座り・電話

## 当院の対応方針

上記の行為が確認された場合、以下の対応をとることがあります。

1. 注意・警告を書面で通知します
2. 改善が見られない場合、診療をお断りする場合があります
3. 刑事事件に該当する場合は警察に通報します

## 正当なご意見・ご要望について

患者様・ご家族からの正当なご意見・改善要望は真摯に受け止めます。お気づきの点は受付窓口または相談員までお申し付けください。

---
${new Date().getFullYear()}年${new Date().getMonth() + 1}月 ${new Date().getDate()}日作成
[医療機関名] 院長・管理者

※このテンプレートをコピーして、医療機関名・日付を記入してご使用ください。`;
}

function parseResult(text: string) {
  const sections = text.split(/^---$/m).map((s) => s.trim()).filter(Boolean);
  return sections;
}

// コピーボタン（フィードバック付き）
function CopyBtn({ text, label = " コピーする", className = "" }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative inline-block">
      <button onClick={handleCopy} className={`text-xs hover:underline transition-colors ${className}`}>
        {copied ? "OK コピー完了！" : label}
      </button>
      {copied && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap shadow-lg animate-bounce">
          OK コピー完了！
        </div>
      )}
    </div>
  );
}

const SCENARIO_TABS = [" 外来", "️ 入院", " 急患・救急"] as const;
type ScenarioTab = typeof SCENARIO_TABS[number];

const SCENARIO_PRESETS: Record<ScenarioTab, { label: string; text: string }[]> = {
  " 外来": [
    { label: " 暴言・怒鳴り", text: "外来受付で患者の家族が「なぜこんなに待たせるんだ」「担当医を替えろ」と大声で怒鳴り続け、他の患者が怖がっている。" },
    { label: "⏰ 長時間居座り", text: "診察終了後も「もっと説明しろ」「納得できない」と2時間以上外来診察室に居座り、次の患者の診察が滞っている。" },
    { label: " 処方変更要求", text: "患者がインターネット情報をもとに、担当医の処方に強く異議を唱え「〇〇を処方しろ」「この薬は効かない」と外来で繰り返し要求してくる。" },
    { label: " 無断録音・録画", text: "外来診察中に患者・家族が許可なく録音・録画し、「Xで公開する」と脅している。スタッフのプライバシーへの影響が心配。" },
    { label: " 会計拒否", text: "会計窓口で「この金額はおかしい」と支払いを拒否し、受付スタッフを怒鳴りつけている。保険請求の説明をしても聞かない。" },
  ],
  "️ 入院": [
    { label: " 転院強要", text: "入院患者の家族が「他の病院に転院させる」「院長を出せ」と繰り返し要求し、主治医への罵倒も続いている。" },
    { label: " 深夜ナース呼び出し", text: "入院患者が深夜に些細なことで何度もナースコールを押し、「すぐ来い」「仕事しろ」と看護師に怒鳴っている。業務に支障が出ている。" },
    { label: "‍‍ 家族の面会トラブル", text: "面会時間外に患者家族が病棟に入り込み、「家族なのになぜ会えないんだ」と看護師に詰め寄り、他の入院患者の迷惑になっている。" },
    { label: " カルテ開示要求", text: "患者家族がカルテ・検査記録の即時全開示を要求し、「隠蔽している」「医療ミスの証拠がある」と主張して病棟で声を荒げている。" },
    { label: " 食事・設備クレーム", text: "入院患者が食事内容・病室設備について過剰な変更要求を繰り返し、担当看護師に「サービスが悪い」と毎日クレームを入れている。" },
  ],
  " 急患・救急": [
    { label: " 繰り返し救急利用", text: "同じ患者が軽症にもかかわらず深夜救急を週3〜4回繰り返し利用し、「すぐ入院させろ」と要求している。真に緊急な患者の対応が遅れている。" },
    { label: " 処置拒否・暴れる", text: "救急搬送された患者が酩酊状態で処置を拒否し、スタッフに怒鳴りながら暴れている。周囲の患者への影響もある。" },
    { label: " 家族の同席強要", text: "救急処置中に家族が処置室への同席を強く要求し、「何をしているのか見せろ」と入室しようとしている。" },
    { label: "! 応招義務を盾に", text: "診察内容に不満を持つ患者が「応招義務があるから断れないはずだ」と主張し、規定外の検査・処置を強要している。" },
    { label: " 警察連携検討", text: "救急来院した患者が「殺すぞ」「家に押しかける」と脅迫的発言をし、スタッフが身の危険を感じている。警察への連絡を検討している。" },
  ],
};

function ScenarioPresets({ onSelect }: { onSelect: (text: string) => void }) {
  const [activeTab, setActiveTab] = useState<ScenarioTab>(" 外来");
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex bg-gray-50 border-b border-gray-200">
        {SCENARIO_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-xs font-medium py-2 transition-colors min-h-[44px] ${
              activeTab === tab
                ? "bg-white text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            aria-label={`${tab}タブを表示する`}
            aria-selected={activeTab === tab}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="p-2 flex flex-wrap gap-1.5 bg-white">
        {SCENARIO_PRESETS[activeTab].map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onSelect(p.text)}
            className="text-xs px-2.5 py-1.5 rounded-full border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors font-medium min-h-[44px]"
            aria-label={`「${p.label}」のシナリオプリセットを入力する`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function IryouTool() {
  const [caseType, setCaseType] = useState(CASE_TYPES[0]);
  const [section, setSection] = useState("");
  const [department, setDepartment] = useState("");
  const [requesterType, setRequesterType] = useState(REQUESTER_TYPES[0]);
  const [severity, setSeverity] = useState("中度");
  const [situation, setSituation] = useState("");
  const [loading, setLoading] = useState(false);
  const [tabs, setTabs] = useState<Record<TabLabel, string> | null>(null);
  const [activeTab, setActiveTab] = useState<TabLabel>(" 口頭スクリプト");
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);
  const [hitLimit, setHitLimit] = useState(false);
  const [showPayjp, setShowPayjp] = useState(false);
  const [completionVisible, setCompletionVisible] = useState(false);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [streakMsg, setStreakMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
    setCount(saved);
    if (saved >= FREE_LIMIT) setHitLimit(true);
    setStreak(loadStreak("iryou"));
    setHistory(loadHistory());
  }, []);

  const currentSeverity = SEVERITY_LEVELS.find(s => s.value === severity) ?? SEVERITY_LEVELS[1];

  const handleGenerate = async () => {
    if (!situation.trim()) { setError("状況を入力してください"); return; }
    track('ai_generated', { service: '医療クレームAI' });
    setLoading(true);
    setError("");
    setTabs(null);
    setCompletionVisible(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseType, section, department, requesterType, severity, situation }),
      });
      if (!res.ok) {
        const data = await res.json();
        if (data.error === "LIMIT_REACHED") { setHitLimit(true); return; }
        const rawMsg: string = data.error || "エラーが発生しました";
        const friendlyMsg = rawMsg.includes("429") || rawMsg.toLowerCase().includes("rate")
          ? "アクセスが集中しています。しばらくお待ちください。"
          : rawMsg.includes("529") || rawMsg.toLowerCase().includes("overload")
          ? "AIサーバーが混雑しています。少し待ってから再試行してください。"
          : rawMsg;
        setError(friendlyMsg);
        return;
      }
      const newCount = parseInt(res.headers.get("X-New-Count") || String(count + 1), 10);
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setTabs(parseResultToTabs(fullText));
      }
      setTabs(parseResultToTabs(fullText));
      setActiveTab(" 口頭スクリプト");
      setCount(newCount);
      localStorage.setItem(STORAGE_KEY, String(newCount));
      if (newCount >= FREE_LIMIT) { track('paywall_shown', { service: '医療クレームAI' }); setHitLimit(true); }
      // ストリーク更新・履歴保存
      const s = updateStreak("iryou");
      setStreak(s);
      const msg = getStreakMilestoneMessage(s.count);
      if (msg) setStreakMsg(msg);
      saveHistory(situation);
      setHistory(loadHistory());

      // 達成感バナー表示
      setCompletionVisible(true);
      setTimeout(() => setCompletionVisible(false), 4000);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(
        msg.includes("429") || msg.toLowerCase().includes("rate")
          ? "アクセスが集中しています。しばらくお待ちください。"
          : msg.includes("529") || msg.toLowerCase().includes("overload")
          ? "AIサーバーが混雑しています。少し待ってから再試行してください。"
          : "通信エラーが発生しました。再試行してください。"
      );
    } finally {
      setLoading(false);
    }
  };

  if (hitLimit) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-sm text-center border border-white/20">
          <div className="text-5xl mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">無料体験（{FREE_LIMIT}回）終了</h2>
          <p className="text-gray-500 text-sm mb-6">
            プレミアムプランで医療クレーム対応文を無制限に生成できます。
          </p>
          <KomojuButton
            planId="business"
            planLabel="医療機関プラン ¥9,800/月"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-3"
          />
          {/* 安心保証バッジ */}
          <div className="flex items-center justify-center gap-4 mt-3">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <span></span>
              <span>SSL暗号化決済</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <span>OK</span>
              <span>いつでもキャンセル可能</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <span></span>
              <span>PAY.JP安全決済</span>
            </div>
          </div>
          <p className="text-xs text-center text-slate-500 mt-2">
            ※ プレミアムプランはいつでもキャンセル可能です
          </p>
          <a href="/" className="text-sm text-gray-400 hover:underline mt-3 block">トップへ戻る</a>
        </div>

        {showPayjp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 max-w-sm w-full shadow-xl relative">
              <button onClick={() => setShowPayjp(false)} className="absolute top-3 right-3 text-gray-400 text-xl min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="プランダイアログを閉じる"></button>
              <h2 className="text-lg font-bold mb-4 text-center">プランに登録</h2>
              <KomojuButton planId="business" planLabel="医療機関プラン ¥9,800/月を始める" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50" />
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">医療クレーム対応文ジェネレーター</h1>
          <p className="text-sm text-gray-500">
            状況を入力して「生成する」を押すだけ。
            無料残り<strong className="text-blue-600">{Math.max(0, FREE_LIMIT - count)}回</strong>
          </p>
          {streak && streak.count > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 text-sm">
              <span aria-label="ストリーク日数">{streak.count}日連続利用中</span>
              {streak.shieldCount > 0 && <span className="text-blue-500 text-xs">シールド{streak.shieldCount}個</span>}
            </div>
          )}
          {streakMsg && (
            <div className="mt-2 text-orange-600 font-bold text-sm animate-bounce">{streakMsg}</div>
          )}
        </div>
        {history.length > 0 && (
          <div className="backdrop-blur-sm bg-white/80 border border-white/40 shadow rounded-2xl p-4 mb-6">
            <h2 className="text-sm font-semibold text-gray-600 mb-2">最近の相談履歴</h2>
            <ul className="space-y-1">
              {history.map((h, i) => (
                <li key={i} className="text-xs text-gray-500 flex justify-between gap-2">
                  <span className="truncate">{h.text}</span>
                  <span className="shrink-0">{h.date}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-white/30 p-6 mb-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">カスハラの種別</label>
            <div className="flex flex-wrap gap-2">
              {CASE_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setCaseType(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors min-h-[44px] ${
                    caseType === t
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
                  }`}
                  aria-label={`カスハラ種別: ${t}を選択`}
                  aria-pressed={caseType === t}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">対応科・部署 <span className="text-gray-400 font-normal text-xs">（任意）</span></label>
            <div className="flex flex-wrap gap-2">
              {SECTION_TYPES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSection(section === s.value ? "" : s.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors min-h-[44px] ${
                    section === s.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
                  }`}
                  aria-label={`対応科・部署: ${s.label}を選択`}
                  aria-pressed={section === s.value}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">診療科 <span className="text-gray-400 font-normal text-xs">（任意・選ぶと精度が上がります）</span></label>
            <div className="flex flex-wrap gap-2">
              {DEPARTMENT_TYPES.slice(1).map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDepartment(department === d.value ? "" : d.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors min-h-[44px] ${
                    department === d.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
                  }`}
                  aria-label={`診療科: ${d.label}を選択`}
                  aria-pressed={department === d.value}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">要求者</label>
              <select
                value={requesterType}
                onChange={(e) => setRequesterType(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="クレーム要求者を選択"
              >
                {REQUESTER_TYPES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">深刻度</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="カスハラの深刻度を選択"
              >
                {SEVERITY_LEVELS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">状況の詳細</label>
              <button
                type="button"
                onClick={() => setSituation(CLAIM_RECORD_TEMPLATE)}
                className="text-xs px-3 py-1.5 rounded-full border border-emerald-400 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors font-medium min-h-[44px]"
                aria-label="クレーム記録テンプレートを状況詳細欄に挿入する"
              >
                 クレーム記録テンプレートを挿入
              </button>
            </div>
            {/* 診療科別シナリオプリセット（外来/入院/急患タブ） */}
            <div className="mb-3">
              <ScenarioPresets onSelect={setSituation} />
            </div>
            <textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="例：患者の家族が診察室に押しかけ、「なぜ今日中に退院させないのか」「医療ミスだ、訴えてやる」と大声で怒鳴り続けている。受付スタッフが対応に困っている。"
              rows={5}
              maxLength={1500}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              aria-label="カスハラ状況の詳細（必須）"
            />
            <p className="text-xs text-gray-400 text-right mt-1">{situation.length}/1500文字</p>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <GlowButton
            onClick={handleGenerate}
            disabled={loading || !situation.trim()}
            aria-label="入力した状況をもとに対応文をAIで生成する"
            variant="primary"
          >
            {loading ? "生成中..." : "対応文を生成する"}
          </GlowButton>
        </div>

        {/* 達成感バナー */}
        <div className={`transition-all duration-500 overflow-hidden ${completionVisible ? "max-h-48 opacity-100 mb-4" : "max-h-0 opacity-0"}`}>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl px-5 py-4 shadow-lg">
            <div className="flex items-center gap-2 font-bold text-base mb-3">
              <span className="text-2xl">OK</span>
              <span>対応文書 作成完了！</span>
            </div>
            {/* カスハラ深刻度スコアバー */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1 opacity-90">
                <span>カスハラ深刻度: {currentSeverity.value}</span>
                <span className="font-bold text-lg">{currentSeverity.score}<span className="text-xs font-normal">/10</span></span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className={`${currentSeverity.color} h-3 rounded-full transition-all duration-700`}
                  style={{ width: `${(currentSeverity.score / 10) * 100}%` }}
                />
              </div>
              <p className="text-xs opacity-70 mt-1">
                {currentSeverity.value === "重度" ? "管理者報告・院内委員会・警察相談を検討してください" :
                 currentSeverity.value === "中度" ? "記録を残しつつ毅然とした対応を" : "誠意を持ちながら適切に対応しましょう"}
              </p>
            </div>
          </div>
        </div>

        {/* 結果タブUI */}
        {(loading || tabs) && (
          <div ref={resultRef} className="space-y-4">
            {loading && !tabs && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-white/20 p-10 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
                <p className="text-sm text-gray-500 font-medium">AIが対応文を作成中...</p>
                <p className="text-xs text-gray-400 mt-1"> 口頭スクリプト →  書面通知文 →  インシデント記録</p>
              </div>
            )}
            {tabs && (
              <>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-sm overflow-hidden">
                  <div className="flex border-b border-gray-200 overflow-x-auto">
                    {TABS.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors min-h-[44px] ${
                          activeTab === tab
                            ? "border-blue-600 text-blue-600 bg-blue-50"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                        aria-label={`${tab}タブを表示する`}
                        aria-selected={activeTab === tab}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="p-5">
                    <div className="flex justify-end mb-3">
                      <CopyBtn text={tabs[activeTab]} label=" コピーする" className="text-blue-600 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50" />
                    </div>
                    <div
                      className="prose prose-sm max-w-none min-h-[180px]"
                      dangerouslySetInnerHTML={{ __html: tabs[activeTab] ? renderMarkdown(tabs[activeTab]) : "<p class='text-gray-400 text-sm'>（生成中...）</p>" }}
                    />
                  </div>
                </div>

                {/* シェアボタン */}
                <div className="bg-blue-50/90 backdrop-blur-sm border border-blue-200/60 rounded-xl p-4 text-center">
                  <p className="text-sm font-bold text-blue-800 mb-3">同じ悩みを持つ医療スタッフへ届けましょう</p>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `医療クレームAIで患者クレームへの対応文書を作成しました！ #医療クレームAI #医療 https://iryou-claim-ai.vercel.app`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="医療クレームAIの対応結果をXにシェアする"
                    className="text-xs px-3 py-1.5 rounded-lg bg-black hover:bg-gray-800 text-white font-medium transition-colors inline-flex items-center gap-2 min-h-[44px]"
                  >
                    Xでシェア
                  </a>
                </div>
                {/* 次のアクション3選 */}
                <div className="bg-white/90 backdrop-blur-sm border border-blue-200/60 rounded-xl p-4">
                  <p className="text-sm font-bold text-blue-800 mb-3"> 次にやるべきこと3選</p>
                  <ol className="space-y-2">
                    {[
                      { icon: "", text: "上長・事務長に今回のケースを口頭で報告する" },
                      { icon: "️", text: "インシデント記録に日時・患者情報・対応内容を記録する" },
                      { icon: "", text: "深刻なケース（脅迫・傷害リスク）は警察・弁護士に相談する" },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className="text-lg leading-none">{item.icon}</span>
                        <span>{i + 1}. {item.text}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                {/* 弁護士相談アフィリエイト（A8.net申請後URLを差し替え） */}
                <div className="bg-blue-50/90 backdrop-blur-sm border border-blue-200/60 rounded-xl p-4">
                  <p className="text-sm font-black text-blue-900 mb-1"> 深刻なクレームは弁護士へ</p>
                  <p className="text-xs text-blue-700 mb-3">脅迫・不退去・傷害リスクは弁護士対応が必須。医療機関向け顧問契約も確認できます。</p>
                  {/* TODO: Replace href with A8.net affiliate URL after approval */}
                  <a href="https://www.bengo4.com/c_1011/" target="_blank" rel="noopener noreferrer sponsored"
                    className="flex items-center justify-between bg-white border border-blue-300 rounded-xl px-3 py-2.5 hover:bg-blue-50 transition-colors">
                    <div>
                      <div className="text-sm font-bold text-slate-800">弁護士ドットコム</div>
                      <div className="text-xs text-slate-500">初回無料 • 医療機関・クリニック向け対応あり</div>
                    </div>
                    <span className="text-blue-600 font-bold text-xs bg-blue-100 px-2 py-1 rounded-full shrink-0">無料相談 →</span>
                  </a>
                  <p className="text-xs text-slate-400 text-center mt-2">※ 広告・PR掲載</p>
                </div>
                {/* ストレスケアアフィリエイト（A8.net SOELU） */}
                <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                  <p className="text-sm font-black text-cyan-900 mb-1"> 医療従事者のストレス発散・ヨガで心身リセット</p>
                  <p className="text-xs text-cyan-700 mb-3">クレーム対応後の緊張・疲労をほぐすオンラインヨガ。自宅で好きな時間に受講でき、医療スタッフの心身ケアにおすすめです。</p>
                  <a href="https://px.a8.net/svt/ejp?a8mat=4AZIOF+8OKLDE+4EPM+63OY9" target="_blank" rel="noopener noreferrer sponsored"
                    className="flex items-center justify-between bg-white border border-cyan-300 rounded-xl px-3 py-2.5 hover:bg-cyan-50 transition-colors">
                    <div>
                      <div className="text-sm font-bold text-slate-800">SOELU（ソエル）オンラインヨガ</div>
                      <div className="text-xs text-slate-500">月額¥3,000〜 • 自宅で完結 • 初回30日無料</div>
                    </div>
                    <span className="text-cyan-600 font-bold text-xs bg-cyan-100 px-2 py-1 rounded-full shrink-0">無料で試す →</span>
                  </a>
                  <p className="text-xs text-slate-400 text-center mt-2">※ 広告・PR掲載</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 text-center">
                  ! この内容はAIが生成した参考文書です。法的助言・医療アドバイスではありません。<br />
                  実際の対応にご使用の際は、医療機関の弁護士・法務担当者に確認の上ご使用ください。
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {showPayjp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 max-w-sm w-full shadow-xl relative">
            <button onClick={() => setShowPayjp(false)} className="absolute top-3 right-3 text-gray-400 text-xl"></button>
            <h2 className="text-lg font-bold mb-4 text-center">プランに登録</h2>
            <KomojuButton planId="business" planLabel="医療機関プラン ¥9,800/月を始める" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50" />
          </div>
        </div>
      )}
    </main>
  );
}
