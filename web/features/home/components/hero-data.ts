import { DocsLogo, PdfLogo, SheetsLogo, SlidesLogo } from "./HeroLogos"

// Demo files, prompts, and animation timings used by the hero illustration.
export const files = [
  { name: "Project brief", meta: "Docs", icon: DocsLogo },
  { name: "Q4 analytics", meta: "Sheets", icon: SheetsLogo },
  { name: "Pitch deck", meta: "Slides", icon: SlidesLogo },
  { name: "Product guide", meta: "PDF", icon: PdfLogo },
]

// Each loop plays one scenario, so the demo feels like real usage.
export const scenarios = [
  {
    prompt: "Find my Q4 analytics sheet",
    tool: "drive.search_files",
    file: 1,
    answer: "Found “Q4 analytics” in your Drive.",
  },
  {
    prompt: "Summarize the project brief",
    tool: "drive.read_file",
    file: 0,
    answer: "Read “Project brief”. Summary ready.",
  },
  {
    prompt: "What's inside the pitch deck?",
    tool: "drive.read_file",
    file: 2,
    answer: "Opened “Pitch deck”. 12 slides found.",
  },
  {
    prompt: "Pull key points from the product guide",
    tool: "drive.read_file",
    file: 3,
    answer: "Extracted key points from “Product guide”.",
  },
]

export const STEP_MS = 1700

// 0 typing → 1 client→MCP → 2 MCP→Drive → 3 Drive scans
// → 4 Drive→MCP → 5 MCP→client (answer)
export const STEPS = 6

// Short labels so they fit inside the circle.
export const mcpStatus = [
  "Idle",
  "Request in",
  "Calling Drive",
  "Waiting",
  "Formatting",
  "Responding",
]

export const ease = [0.22, 1, 0.36, 1] as const

// Lane geometry in the 500x500 SVG space.
// Client card: 0–140 (28%). MCP circle: top 175, size 130 → at x=225/275 its
// edges sit at y≈180 (top) and y≈300 (bottom). Drive card starts at 345 (69%).
export const CLIENT_BOTTOM = 140
export const MCP_TOP = 180
export const MCP_BOTTOM = 300
export const DRIVE_TOP = 345

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
