import { ImageResponse } from "next/og"

export const alt = "Drivebridge — Google Drive for your AI workspace"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f6f2",
        color: "#21372b",
        position: "relative",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: -130,
          top: -230,
          width: 600,
          height: 600,
          border: "2px solid #4d785b33",
          borderRadius: 300,
        }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: -40,
          top: -140,
          width: 420,
          height: 420,
          border: "2px solid #4d785b33",
          borderRadius: 240,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 960,
          gap: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 58,
              height: 58,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 17,
              background: "#376447",
              color: "white",
              fontSize: 32,
            }}
          >
            ↗
          </div>
          drivebridge
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              color: "#376447",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 5,
            }}
          >
            YOUR DRIVE, IN THE FLOW
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 84,
              lineHeight: 1.02,
              fontWeight: 700,
              letterSpacing: -5,
            }}
          >
            <span>Google Drive</span>
            <span>for your AI workspace.</span>
          </div>
          <div style={{ color: "#66756a", fontSize: 26 }}>
            A clear, secure connection through MCP.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: 82,
            height: 8,
            borderRadius: 8,
            background: "#85a66e",
          }}
        />
      </div>
    </div>,
    size
  )
}
