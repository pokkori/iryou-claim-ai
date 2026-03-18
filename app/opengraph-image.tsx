import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "医療クレームAI | 医療機関向けクレーム対応文書を30秒で生成";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 50%, #1e40af 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 16 }}>🏥</div>
        <div style={{ fontSize: 52, fontWeight: 700, color: "#93c5fd", marginBottom: 16, textAlign: "center" }}>
          医療クレームAI
        </div>
        <div style={{ fontSize: 28, color: "#dbeafe", textAlign: "center", maxWidth: 900 }}>
          医療機関向けクレーム・カスハラ対応文書を30秒で生成
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
          {["エスカレーション判定", "刑法適用判断", "無料3回"].map((label) => (
            <div
              key={label}
              style={{
                padding: "8px 20px",
                background: "rgba(147,197,253,0.15)",
                border: "1px solid rgba(147,197,253,0.5)",
                borderRadius: 24,
                fontSize: 18,
                color: "#bfdbfe",
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 32,
            padding: "12px 36px",
            background: "#2563eb",
            borderRadius: 40,
            fontSize: 22,
            color: "#fff",
            fontWeight: 700,
          }}
        >
          無料3回 → ¥9,800/月〜
        </div>
      </div>
    ),
    { ...size }
  );
}
