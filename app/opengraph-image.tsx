import { ImageResponse } from "next/og";
import { siteTagline } from "@/lib/site";

// The link-preview card, drawn by the app in its own look (DEMO-STANDARD.md).
// An image cannot read CSS variables, so these hex values copy app/globals.css.
const paper = "#f5f3ee";
const ink = "#15201e";
const muted = "#59635f";
const brand = "#0e5c57";
const sun = "#f2a541";
const bubble = "#e9e6df";

export const alt = `Quote to Paid: ${siteTagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: paper, color: ink, padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontWeight: 700 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: brand, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="44" height="44" viewBox="0 0 32 32">
                <path d="M9 9.5h14a2.5 2.5 0 0 1 2.5 2.5v7a2.5 2.5 0 0 1-2.5 2.5h-6.5L12 25v-3.5H9A2.5 2.5 0 0 1 6.5 19v-7A2.5 2.5 0 0 1 9 9.5z" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
                <path d="M11.8 15.6l2.8 2.8 5.6-5.6" fill="none" stroke={sun} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            Quote to Paid
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 48, fontSize: 74, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
            <span>No quote or invoice</span>
            <span>goes quiet.</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: muted, maxWidth: 640 }}>Polite follow-ups by text until the customer answers or pays. Then it stops.</div>
          <div style={{ display: "flex", marginTop: "auto" }}>
            <div style={{ display: "flex", padding: "14px 30px", borderRadius: 999, background: brand, color: "#fff", fontSize: 28, fontWeight: 700 }}>Try the demo · no signup</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, width: 330 }}>
          <div style={{ display: "flex", background: bubble, borderRadius: 24, padding: "16px 20px", fontSize: 24, lineHeight: 1.3 }}>Just checking the quote came through OK.</div>
          <div style={{ display: "flex", alignSelf: "flex-end", background: brand, color: "#fff", borderRadius: 24, padding: "16px 20px", fontSize: 24 }}>Yes, let&apos;s do it!</div>
          <div style={{ display: "flex", alignSelf: "center", background: "#d9ecdd", color: "#1d5f33", borderRadius: 999, padding: "8px 18px", fontSize: 20, fontWeight: 700 }}>
            Follow-ups stopped
          </div>
        </div>
      </div>
    ),
    size,
  );
}
