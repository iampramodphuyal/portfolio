import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.title}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 900,
            borderRadius: 16,
            border: "1px solid #3f3f46",
            background: "#09090b",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "18px 24px",
              background: "#18181b",
              borderBottom: "1px solid #3f3f46",
            }}
          >
            <div style={{ width: 16, height: 16, borderRadius: 8, background: "#ff5f56" }} />
            <div style={{ width: 16, height: 16, borderRadius: 8, background: "#ffbd2e" }} />
            <div style={{ width: 16, height: 16, borderRadius: 8, background: "#27c93f" }} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "48px 56px 64px",
              gap: 28,
            }}
          >
            <div style={{ display: "flex", fontSize: 30, color: "#a1a1aa" }}>
              <span style={{ color: "#4ade80" }}>$&nbsp;</span>
              <span>curl {site.url.replace("https://", "")}</span>
            </div>
            <div style={{ display: "flex", fontSize: 76, fontWeight: 700, color: "#fafafa" }}>
              {site.name}
            </div>
            <div style={{ display: "flex", fontSize: 34, color: "#71717a" }}>
              {site.title}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
