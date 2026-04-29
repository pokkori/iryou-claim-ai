/**
 * LINE ステップ配信 CRON - 医療クレームAI
 * GET /api/cron/line-step
 * Vercel CRON: "0 0 * * *" (毎日 09:00 JST)
 *
 * 医療クレームAI専用シーケンス（医療機関向けクレーム・カスハラ対応訴求）
 */

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SERVICE_URL = "https://iryou-claim-ai.vercel.app";
const SERVICE_NAME = "医療クレームAI";
const APP_ID = "iryo-claim";

interface StepDef {
  step: number;
  nextStep: number | null;
  daysUntilNext: number;
  message: string;
}

const STEPS: StepDef[] = [
  {
    step: 1,
    nextStep: 2,
    daysUntilNext: 2,
    message: `【${SERVICE_NAME}】ご登録ありがとうございます。

クレーム事例を入力するだけで、法的にセーフな対応文を即座に生成します。
まずは無料でお試しください。

${SERVICE_URL}`,
  },
  {
    step: 2,
    nextStep: 3,
    daysUntilNext: 3,
    message: `【${SERVICE_NAME}】悪質クレーマーへの毅然とした断り方、AIが生成します。

「診療拒否はできるか」「録音への対応は」「警察への相談タイミングは」など、現場で使える対応文を法的根拠とともに提示します。

${SERVICE_URL}`,
  },
  {
    step: 3,
    nextStep: 4,
    daysUntilNext: 2,
    message: `【${SERVICE_NAME}】月額プランのご案内です。

月額プランなら、クレーム対応マニュアルも自動生成できます。
受付・看護師・院長向けに文体を変えた複数バージョンを即座に作成。

詳細: ${SERVICE_URL}#pricing`,
  },
  {
    step: 4,
    nextStep: null,
    daysUntilNext: 0,
    message: `【${SERVICE_NAME}】医療機関向け特別プランのご案内です。

月額プラン1つで、複数スタッフでのご利用が可能です。
受付・外来・病棟など部署ごとにアカウントを分けても追加料金なし。

詳細・お申し込みはこちら: ${SERVICE_URL}#pricing`,
  },
];

async function sendLineMessage(userId: string, text: string): Promise<boolean> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) return false;
  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: "text", text }],
    }),
  });
  return res.ok;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const now = new Date();
  const maxStep = STEPS.length;

  const { data: users, error } = await supabase
    .from("line_step_users")
    .select("id, line_user_id, step, next_send_at")
    .lte("next_send_at", now.toISOString())
    .lt("step", maxStep)
    .eq("app_id", APP_ID)
    .order("next_send_at", { ascending: true })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: { userId: string; step: number; status: string }[] = [];

  for (const user of users ?? []) {
    const stepDef = STEPS.find((s) => s.step === (user.step as number) + 1);
    if (!stepDef) continue;

    const sent = await sendLineMessage(user.line_user_id as string, stepDef.message);
    const nextSendAt =
      stepDef.nextStep !== null && stepDef.daysUntilNext > 0
        ? new Date(now.getTime() + stepDef.daysUntilNext * 86400 * 1000).toISOString()
        : null;

    await supabase
      .from("line_step_users")
      .update({
        step: stepDef.step,
        next_send_at: nextSendAt,
        updated_at: now.toISOString(),
      })
      .eq("id", user.id);

    results.push({
      userId: user.line_user_id as string,
      step: stepDef.step,
      status: sent ? "sent" : "error",
    });
  }

  return NextResponse.json({
    processed: results.length,
    results,
    executedAt: now.toISOString(),
  });
}
