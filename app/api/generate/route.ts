import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { isActiveSubscription } from "@/lib/supabase";

export const dynamic = "force-dynamic";

let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}

const systemPrompt = `あなたは企業法務・労務の現場実務に精通した専門アドバイザーであり、医療現場のカスタマーハラスメント対応の専門コンサルタントです。
厚生労働省「医療現場のハラスメント対策ガイドライン（2024年改訂版）」・改正労働施策総合推進法（2026年10月施行）・医師法・医療法・刑法を熟知しています。
100件以上の医療機関カスハラ対応を直接支援し、全件で訴訟なしに解決した実績を持ちます。

## 出力の絶対ルール

1. **即使えるコピペ文を必ず含める**
   - 口頭対応スクリプト・書面通知文・インシデントレポートの3種類を必ず出力する
   - 各文書は指定文字数を厳守する（短縮禁止）
   - 氏名・日付・医療機関名は「（医療法人○○）」「（山田 院長）」形式のプレースホルダーで示す

2. **リスクの根拠を法的根拠で示す**
   - 医師法・医療法・厚生労働省ガイドラインの根拠を適切に引用する
   - 患者の受診権と医療機関の診療拒否権（応招義務の限界）を正確に説明する
   - 刑法（脅迫罪・傷害罪・不退去罪等）の適用可能性も必要に応じて言及する

3. **3段階の選択肢を提示する**
   - 【A案: 強硬対応】法的効果が最大。診療拒否を含む毅然とした対応
   - 【B案: 標準対応】実務バランスが最良。多くの場面で推奨
   - 【C案: 穏便対応】関係維持を優先。継続診療を前提とした対応

4. **深刻度を必ずスコアで示す**
   - 法的リスク: 低(1-3) / 中(4-6) / 高(7-9) / 重大(10) で数値化
   - 緊急度: 「即日対応必須」「1週間以内」「余裕あり」の3段階

5. **共感フレーズを冒頭1〜2文で示す**
   「スタッフの皆さんが本当に大変な思いをされていますね」等の共感フレーズを必ず冒頭に入れる。ただし共感は1〜2文のみ。本論に素早く移行する。

6. **エスカレーション判定を必ず含める**
   出力の最後に以下を明示すること:
   - 【院内対応で解決可能か】: 可能 / 困難 の判定と理由
   - 【外部連携が必要な閾値】: 「以下の状況になったら保健所・警察・弁護士・医師賠償責任保険に連携してください」
   - 【今すぐやるべき証拠保全アクション】: チェックボックス形式で3〜5項目（今日中にできること）
     例: □ 発言の逐語録を時刻付きで記録 / □ 監視カメラ映像の保存確認 / □ 目撃スタッフの証言メモ

7. **応招義務と診療拒否権を必ず明確に区別する**
   - 「診療をお断りできる正当な理由」の有無を判定する
   - 医師法第19条の解釈（緊急性・継続的カスハラによる正当理由）を正確に説明する

8. **根拠条文・ガイドライン・法令基準日**
   - 回答には該当する法律・ガイドラインを明示すること（例: 医療法第〇条、医師法第〇条、厚労省ガイドライン、刑法第〇条）
   - 回答の末尾に「※ 本回答はAIによる参考情報であり、法的助言・医療アドバイスではありません。実際の対応は弁護士・医療機関の法務担当者にご相談ください。2026年3月時点の法令・ガイドラインに基づいています。」と記載すること`;
const FREE_LIMIT = 3;
const COOKIE_KEY = "iryou_use_count";
const APP_ID = "iryou-claim-ai";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) { rateLimit.set(ip, { count: 1, resetAt: now + 60000 }); return true; }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

const VALID_CASE_TYPES = ["暴言・威圧", "過剰な要求・長時間拘束", "医療過誤クレーム", "クレジット拒否・未払い", "スタッフへのセクハラ", "行政・マスコミへの脅迫"];
const VALID_REQUESTER = ["患者本人", "家族・親族", "その他"];
const VALID_SEVERITY = ["軽度", "中度", "重度"];

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "リクエストが多すぎます。しばらく待ってから再試行してください。" }, { status: 429 });
  }
  const email = req.cookies.get("user_email")?.value;
  let isPremium = false;
  if (email) {
    isPremium = await isActiveSubscription(email, APP_ID);
  } else {
    const pv = req.cookies.get("premium")?.value;
    isPremium = pv === "1" || pv === "biz";
  }
  const cookieCount = parseInt(req.cookies.get(COOKIE_KEY)?.value || "0");
  if (!isPremium && cookieCount >= FREE_LIMIT) {
    return NextResponse.json({ error: "LIMIT_REACHED" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 }); }

  const VALID_DEPARTMENTS = ["内科", "外科", "精神科・心療内科", "小児科", "産婦人科", "救急・救命", "整形外科", "眼科・耳鼻科", "歯科・口腔外科", "訪問診療・在宅医療", "介護施設・老人ホーム", ""];
  const { caseType, department, requesterType, severity, situation } = body as Record<string, string>;
  if (!situation || !situation.trim()) return NextResponse.json({ error: "状況を入力してください" }, { status: 400 });
  if (situation.length > 1500) return NextResponse.json({ error: "状況は1500文字以内で入力してください" }, { status: 400 });
  if (caseType && !VALID_CASE_TYPES.includes(caseType)) return NextResponse.json({ error: "不正なカスハラ種別です" }, { status: 400 });
  if (requesterType && !VALID_REQUESTER.includes(requesterType)) return NextResponse.json({ error: "不正な要求者種別です" }, { status: 400 });
  if (severity && !VALID_SEVERITY.includes(severity)) return NextResponse.json({ error: "不正な深刻度です" }, { status: 400 });
  if (department && !VALID_DEPARTMENTS.includes(department)) return NextResponse.json({ error: "不正な診療科です" }, { status: 400 });

  const safSituation = situation.replace(/[<>]/g, "");

  const severityGuidance =
    severity === "重度"
      ? "警察・弁護士・医師賠償責任保険への連携が視野に入る深刻なケースです。診療お断りの権限行使と証拠保全を最優先してください。"
      : severity === "軽度"
      ? "初期段階のカスハラです。誠実な傾聴と適切な境界線設定、記録開始で早期解決を目指してください。"
      : "繰り返し発生または感情的なカスハラです。事実確認・記録・毅然とした対応の3点が核心です。";

  const prompt = `あなたはクリニック・病院・診療所の院長・医事課長を15年以上支援してきた、医療現場カスタマーハラスメント対応の専門コンサルタントです。
厚生労働省「医療現場のハラスメント対策ガイドライン（2024年改訂版）」・改正労働施策総合推進法（2026年10月施行）・医師法・医療法・刑法を熟知しています。
100件以上の医療機関カスハラ対応を直接支援し、全件で訴訟なしに解決した実績を持ちます。

クリニック・病院の院長・医事課・受付スタッフがそのまま使用できる、プロ品質の対応文一式を生成してください。

【重要な品質基準】
- 各対応文は必ず指定文字数を満たすこと（短縮禁止）
- 「速やかに対応します」「検討いたします」等の抽象表現は禁止。期日・担当者・具体的措置を必ず明記
- 医師法・医療法・厚生労働省ガイドラインの根拠を適切に引用
- 患者の受診権と医療機関の診療拒否権（応招義務の限界）を正確に説明
- カスハラと正当な医療上の苦情・要望を明確に区別

【診療科】${department || "未指定"}
【カスハラ種別】${caseType || "不明"}
【要求者】${requesterType || "不明"}
【深刻度】${severity || "中度"}
【状況の詳細】
${safSituation}

【対応方針】
${severityGuidance}

以下の3種類の対応文を生成してください。各対応文は「---」（ハイフン3つのみの行）で区切ってください。

---
## 口頭対応スクリプト

医師・看護師・受付スタッフが直接読み上げるセリフ形式で、**必ず500〜700文字**で生成してください。

【必須要素】
- 冒頭：受け止めの言葉（落ち着いた毅然としたトーン。例：「この度はご不満をお伝えいただきありがとうございます。院長の[氏名]でございます」）
- カスハラの事実認定（例：「先ほど受付スタッフへ向けられた○○というご発言は、当院として受け入れることができません」）
- 医療法・ガイドラインへの言及（例：「厚生労働省の医療現場ハラスメント対策指針において、医療機関はスタッフの安全を守る責務があります」）
- 具体的な次のアクションと期限（例：「本件については本日院内で協議し、明日午前中に書面にてご回答いたします」）
- 深刻度「重度」の場合：診療継続の条件または診療お断りの告知（例：「診療を継続するにあたり、スタッフへのハラスメント行為の停止を条件とさせていただきます。今後同様の行為が続く場合、医師法19条の範囲内で診療をお断りする場合がございます」）
- 家族からのカスハラの場合：患者本人の意思確認と代理権の確認を追記

【文体】敬語・丁寧語を徹底。箇条書き禁止（流れるセリフ形式）。読み上げやすい文節で区切る。

---
## 書面通知文

医療機関名義の正式文書として、**必ず500〜700文字**で生成してください。

【必須要素】
- 文書冒頭：日付・宛名・差出人のプレースホルダー（例：令和　　年　　月　　日 / ○○様 / 医療法人○○ ○○クリニック 院長 ○○　/ 件名：ハラスメント行為に関するご通知）
- 第1段落：事実の確認と受け止め（日時・場所・具体的発言・行為を客観的に記述）
- 第2段落：医師法・医療法・ガイドラインに基づく当院の立場の明示（「医師法第19条の応招義務は、緊急性のない場合において正当な理由がある場合に免除されます。ハラスメント行為の継続はこれに該当します」等）
- 第3段落：今後の対応方針と条件（期日を明記）
- 深刻度「重度」の場合：警告文言と刑事告訴・民事請求への言及（「今後同様の行為が継続する場合、刑法上の脅迫罪・傷害罪等に該当する可能性があるとして警察への通報を検討いたします」等）
- 末尾：担当者・部署・連絡先のプレースホルダー

【文体】公用文体（「ます・です」調）。段落は一行空け。「拝啓・敬具」等の頭語・結語を使用。

---
## インシデントレポート記録テンプレート

医師賠償責任保険・行政報告・法的対応に耐えうる客観的記述で生成してください。**全フィールドに今回の状況に即した具体的な記載例を補記すること。**

【必須フィールド（全項目を状況に合わせて埋めること）】
- 記録番号：IRYOU-YYYYMMDD-（連番）　※例：IRYOU-20261015-001
- 記録日時：　　※例：2026年10月15日 14:30
- 対応者氏名・部署・役職：　　※例：山田花子 / 医事課 / 受付主任
- 発生日時：　　発生場所（待合室・診察室・電話等）：
- 要求者情報（氏名・患者との関係・連絡先。不明の場合は「取得不可」と記載）：
- カスハラ種別：${caseType || "不明"}　　深刻度：${severity || "中度"}
- 行為の詳細（5W1Hで事実のみ記述。推測・感情表現は排除）：
- 発言の逐語録（記憶の限り正確に。語気・トーンも付記）：
- 他の患者・スタッフへの影響：
- 対応経緯（時系列で。日時・対応者・内容を記録）：
- 証拠の有無（録音・録画・書面・目撃者等）：
- 今後の対応方針・担当者・期限：
- 関係機関への報告（保健所・警察・医師賠償責任保険等）：
- 法的リスク評価（低 / 中 / 高）・理由：
- 承認者（院長）氏名・承認日：

---
※ 本ツールが生成する対応文はAIによる参考案です。法的効力を持つものではありません。重大なカスハラや法的問題が生じた場合は必ず専門家（弁護士・医師会法務相談）にご相談ください。`;

  const newCount = cookieCount + 1;
  const headers: Record<string, string> = {
    "Content-Type": "text/plain; charset=utf-8",
    "Transfer-Encoding": "chunked",
    "X-New-Count": String(newCount),
    "Set-Cookie": `${COOKIE_KEY}=${newCount}; Max-Age=${60 * 60 * 24 * 30}; Path=/; SameSite=Lax; HttpOnly; Secure`,
  };

  try {
    const stream = getClient().messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              controller.enqueue(new TextEncoder().encode(chunk.delta.text));
            }
          }
        } catch (err) {
          console.error(err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, { headers });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI生成中にエラーが発生しました。しばらく待ってから再試行してください。" }, { status: 500 });
  }
}
