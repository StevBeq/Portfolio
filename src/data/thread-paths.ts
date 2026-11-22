/**
 * "Benang Biru" Sketch-Reveal Path System (C1 Loader · C2 Hero · C3 Portrait)
 *
 * Strict Aesthetic & Technical Contract (SKETCH-REVEAL-DISCUSSION.md):
 * - Closed 3-type technical vocabulary ONLY:
 *     1. "hatching" — disciplined parallel/converging architectural energy strokes
 *     2. "crop"     — precision engineering crop-marks, registration ticks, datum axes
 *     3. "arc"      — geometric drafting arcs & iris circles
 * - Steady-hand Bezier curves with round caps (ZERO line-boil, ZERO spiral doodles, ZERO filters/blurs)
 * - Every animated stroke uses SVG `pathLength={1}` -> ZERO getTotalLength() layout thrash
 * - Total path budget across C1 + C2 + C3 = 31 paths (strictly <= 38 cap)
 * - All colors reference the global `--thread` CSS token family
 */

export type ThreadVocabKind = "hatching" | "crop" | "arc";

export interface ThreadStrokeSpec {
  id: string;
  d: string;
  kind: ThreadVocabKind;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  delay: number;
  duration: number;
}

/**
 * C1 — "BENANG MENGGAMBAR DIRINYA" (Loading Screen)
 * Single continuous SB monogram path faithful to LogoDark.webp geometry:
 * Starts bottom-left S bar -> loops cleanly into upper S bar -> spans across B top bar ->
 * sweeps upper B bowl -> center waist -> lower B bowl -> bottom bar -> rises vertically
 * and TERMINATES directly at the 6px Vermilion center dot (118, 65).
 */
export const LOADER_SB_STROKE = {
  viewBox: "0 0 220 220",
  // Single unbroken continuous cubic-bezier path (1 path!): mathematically parallel 38° S bars -> balanced B -> terminus (116, 110)
  d: [
    "M 24 147",
    "L 78 105",
    "C 84 100, 78 94, 70 97",
    "L 34 109",
    "C 26 112, 22 108, 28 103",
    "L 82 63",
    "C 90 58, 100 63, 116 63",
    "L 152 63",
    "C 180 63, 194 75, 194 87",
    "C 194 100, 180 110, 152 110",
    "L 138 110",
    "C 178 110, 196 119, 196 133",
    "C 196 147, 180 157, 152 157",
    "L 116 157",
    "L 116 110",
  ].join(" "),
  terminus: { x: 116, y: 110 },
  outerRing: { cx: 110, cy: 110, r: 102 },
} as const;

/**
 * C2 — "TINTA MENUMPUK" (Hero Autoplay Wow, 15 scribble paths + 1 settled signature underline = 16 paths)
 * ViewBox 880 x 140 positioned directly beneath/framing the Hero headline.
 * Chaos-that-resolves-to-discipline: 15 technical drafting/hatching/arc strokes accumulate in 1.05s,
 * then compress into a 12% faint blueprint residue as 1 steady signature underline locks in place.
 */
export const HERO_SCRIBBLE_VIEWBOX = "0 0 880 140";

export const HERO_SCRIBBLE_BUNDLE: ThreadStrokeSpec[] = [
  // Group 1: Disciplined parallel architectural hatching sweeps (converging energy toward center datum)
  {
    id: "h-hatch-1",
    kind: "hatching",
    d: "M 92 108 C 210 66, 330 42, 468 38",
    stroke: "var(--thread)",
    strokeWidth: 1.8,
    opacity: 0.9,
    delay: 0.0,
    duration: 0.62,
  },
  {
    id: "h-hatch-2",
    kind: "hatching",
    d: "M 136 118 C 270 84, 415 62, 604 48",
    stroke: "var(--thread-mid)",
    strokeWidth: 1.4,
    opacity: 0.75,
    delay: 0.05,
    duration: 0.65,
  },
  {
    id: "h-hatch-3",
    kind: "hatching",
    d: "M 218 124 C 378 96, 540 72, 742 36",
    stroke: "var(--thread)",
    strokeWidth: 2.0,
    opacity: 0.92,
    delay: 0.1,
    duration: 0.68,
  },
  {
    id: "h-hatch-4",
    kind: "hatching",
    d: "M 786 32 C 650 68, 502 96, 314 114",
    stroke: "var(--thread-light)",
    strokeWidth: 1.3,
    opacity: 0.72,
    delay: 0.16,
    duration: 0.64,
  },
  {
    id: "h-hatch-5",
    kind: "hatching",
    d: "M 738 22 C 584 52, 432 76, 178 92",
    stroke: "var(--thread-mid)",
    strokeWidth: 1.5,
    opacity: 0.8,
    delay: 0.21,
    duration: 0.66,
  },
  {
    id: "h-hatch-6",
    kind: "hatching",
    d: "M 264 26 L 318 82",
    stroke: "var(--thread-mid)",
    strokeWidth: 1.2,
    opacity: 0.55,
    delay: 0.26,
    duration: 0.42,
  },
  {
    id: "h-hatch-7",
    kind: "hatching",
    d: "M 284 26 L 338 82",
    stroke: "var(--thread)",
    strokeWidth: 1.2,
    opacity: 0.65,
    delay: 0.3,
    duration: 0.42,
  },
  {
    id: "h-hatch-8",
    kind: "hatching",
    d: "M 562 24 L 616 80",
    stroke: "var(--thread-mid)",
    strokeWidth: 1.2,
    opacity: 0.55,
    delay: 0.34,
    duration: 0.42,
  },

  // Group 2: Geometric drafting arcs framing the signature horizon
  {
    id: "h-arc-1",
    kind: "arc",
    d: "M 104 72 C 260 14, 620 14, 776 72",
    stroke: "var(--thread)",
    strokeWidth: 1.75,
    opacity: 0.88,
    delay: 0.14,
    duration: 0.74,
  },
  {
    id: "h-arc-2",
    kind: "arc",
    d: "M 164 88 C 330 128, 550 128, 716 88",
    stroke: "var(--thread-mid)",
    strokeWidth: 1.5,
    opacity: 0.78,
    delay: 0.24,
    duration: 0.72,
  },
  {
    id: "h-arc-3",
    kind: "arc",
    d: "M 360 72 A 80 42 0 0 1 520 72",
    stroke: "var(--thread-light)",
    strokeWidth: 1.3,
    opacity: 0.68,
    delay: 0.38,
    duration: 0.56,
  },

  // Group 3: Engineering crop-marks & dimension rails anchoring left/right edges
  {
    id: "h-crop-left",
    kind: "crop",
    d: "M 74 44 L 74 102 L 106 102",
    stroke: "var(--thread-mid)",
    strokeWidth: 1.4,
    opacity: 0.72,
    delay: 0.32,
    duration: 0.48,
  },
  {
    id: "h-crop-right",
    kind: "crop",
    d: "M 806 44 L 806 102 L 774 102",
    stroke: "var(--thread-mid)",
    strokeWidth: 1.4,
    opacity: 0.72,
    delay: 0.36,
    duration: 0.48,
  },
  {
    id: "h-datum-center",
    kind: "crop",
    d: "M 440 16 L 440 116",
    stroke: "var(--thread-light)",
    strokeWidth: 1.1,
    opacity: 0.48,
    delay: 0.42,
    duration: 0.46,
  },
  // Final lead-in stroke terminating at (118, 76) — exact seed point for the steady signature underline!
  {
    id: "h-lead-in",
    kind: "arc",
    d: "M 762 76 C 610 108, 280 54, 118 76",
    stroke: "var(--thread)",
    strokeWidth: 2.0,
    opacity: 0.96,
    delay: 0.44,
    duration: 0.62,
  },
];

/**
 * Settled Hero Signature Form (1 steady hand-authored underline emerging directly from h-lead-in terminus (118, 76))
 */
export const HERO_SIGNATURE_FORM = {
  d: "M 118 76 C 288 68, 592 68, 762 76",
  startPoint: { x: 118, y: 76 },
  endPoint: { x: 762, y: 76 },
} as const;

/**
 * C3 — "SKETSA MENYALA" (Portrait Scrub Schematic Overlay, 13 paths total — reuses exact 3-type vocab!)
 * ViewBox 600 x 680 framing the centered 415x530 portrait crop box with safeEllipse exclusion around face.
 */
export const PORTRAIT_SCHEMATIC = {
  viewBox: "0 0 600 680",
  safeEllipse: { cx: 300, cy: 340, rx: 168, ry: 215 },

  // 6 Outer chaotic-to-disciplined architectural hatching strokes (STRICTLY outside safeEllipse!)
  chaosHatching: [
    {
      id: "p-hatch-1",
      kind: "hatching" as const,
      d: "M 34 152 L 106 80",
      stroke: "var(--thread)",
      strokeWidth: 1.8,
      opacity: 0.85,
    },
    {
      id: "p-hatch-2",
      kind: "hatching" as const,
      d: "M 26 184 L 112 98",
      stroke: "var(--thread-mid)",
      strokeWidth: 1.3,
      opacity: 0.65,
    },
    {
      id: "p-hatch-3",
      kind: "hatching" as const,
      d: "M 494 84 L 568 158",
      stroke: "var(--thread)",
      strokeWidth: 1.8,
      opacity: 0.85,
    },
    {
      id: "p-hatch-4",
      kind: "hatching" as const,
      d: "M 486 102 L 574 190",
      stroke: "var(--thread-mid)",
      strokeWidth: 1.3,
      opacity: 0.65,
    },
    {
      id: "p-hatch-5",
      kind: "hatching" as const,
      d: "M 32 524 L 108 600",
      stroke: "var(--thread-mid)",
      strokeWidth: 1.5,
      opacity: 0.72,
    },
    {
      id: "p-hatch-6",
      kind: "hatching" as const,
      d: "M 568 524 L 492 600",
      stroke: "var(--thread-mid)",
      strokeWidth: 1.5,
      opacity: 0.72,
    },
  ],

  // 6 Precision Engineering Crop-Marks & Dimension Lines
  cropMarks: [
    {
      id: "p-crop-tl",
      kind: "crop" as const,
      d: "M 70 112 L 70 64 L 122 64",
      stroke: "var(--thread-light)",
      strokeWidth: 1.6,
      opacity: 0.85,
    },
    {
      id: "p-crop-tr",
      kind: "crop" as const,
      d: "M 478 64 L 530 64 L 530 112",
      stroke: "var(--thread-light)",
      strokeWidth: 1.6,
      opacity: 0.85,
    },
    {
      id: "p-crop-bl",
      kind: "crop" as const,
      d: "M 70 568 L 70 616 L 122 616",
      stroke: "var(--thread-light)",
      strokeWidth: 1.6,
      opacity: 0.85,
    },
    {
      id: "p-crop-br",
      kind: "crop" as const,
      d: "M 478 616 L 530 616 L 530 568",
      stroke: "var(--thread-light)",
      strokeWidth: 1.6,
      opacity: 0.85,
    },
    // Top & bottom technical axis datum ticks
    {
      id: "p-axis-top",
      kind: "crop" as const,
      d: "M 300 26 L 300 54 M 284 40 L 316 40",
      stroke: "var(--thread)",
      strokeWidth: 1.4,
      opacity: 0.75,
    },
    {
      id: "p-axis-bot",
      kind: "crop" as const,
      d: "M 300 626 L 300 654 M 284 640 L 316 640",
      stroke: "var(--thread)",
      strokeWidth: 1.4,
      opacity: 0.75,
    },
  ],

  // Final Enclosing Iris Circle (p=0.86 -> 0.96): LOCKS portrait & expands directly into Junction C!
  irisCircle: {
    cx: 300,
    cy: 340,
    r: 252,
    // Starts cleanly at top datum (300, 88) and draws 360deg clockwise
    d: "M 300 88 A 252 252 0 1 1 299.9 88 Z",
  },

  // 6 Crisp Mono Engineering Callouts (zero clutter, positioned outside safeEllipse)
  annotations: [
    { id: "ann-1", text: "01 // schematic", x: 74, y: 50, align: "start" as const },
    { id: "ann-2", text: "grid: 4px · duotone", x: 526, y: 50, align: "end" as const },
    { id: "ann-3", text: "crop: auto-bounds", x: 74, y: 636, align: "start" as const },
    { id: "ann-4", text: "resolve: ascii → photo", x: 526, y: 636, align: "end" as const },
    { id: "ann-5", text: "axis 50.0%", x: 324, y: 44, align: "start" as const },
    { id: "ann-6", text: "gate // iris-c", x: 324, y: 644, align: "start" as const },
  ],
} as const;
