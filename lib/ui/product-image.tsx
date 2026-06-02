"use client";

/**
 * Inline SVG product illustrations.
 *
 * Each product gets a hand-tuned illustration that shows what the product is.
 * Driven by SKU prefix, so adding a new SKU only needs a new branch here.
 *
 * Rendered into a flexible-ratio container — pass height via the wrapping
 * element. The SVGs use preserveAspectRatio="xMidYMid slice" so they fill
 * the box cleanly.
 */

interface Palette {
  base:   string;
  mid:    string;
  dark:   string;
  light:  string;
  accent?: string;
}

const PALETTES: Record<string, Palette> = {
  carrara:    { base: "#E8E2D5", mid: "#D6CFBE", dark: "#9C8E72", light: "#F4F0E5", accent: "#7A6E55" },
  oakLvt:     { base: "#7C5733", mid: "#5E4022", dark: "#3F2A18", light: "#9A714B", accent: "#2A1A0D" },
  stormSpc:   { base: "#9AA3AB", mid: "#7B848C", dark: "#5C656E", light: "#B2BAC1", accent: "#3A4047" },
  naturalLvt: { base: "#D9CFB8", mid: "#BCAF8E", dark: "#8E7E55", light: "#E8E0CC", accent: "#6E6040" },
  marbleGls:  { base: "#F0EFEB", mid: "#DEDBD0", dark: "#A39E8A", light: "#FAFAF7", accent: "#7A7560" },
  charcoalMt: { base: "#4A4E55", mid: "#373B41", dark: "#26292E", light: "#5F646C", accent: "#1A1C20" },
  copperMet:  { base: "#B07344", mid: "#925C33", dark: "#6B4124", light: "#D38C5A", accent: "#FFC58A" },
  ceilingWh:  { base: "#F8F7F2", mid: "#EAE7DE", dark: "#C7C3B6", light: "#FFFFFF", accent: "#A89E80" },
  ceilingOak: { base: "#D3B689", mid: "#B89968", dark: "#8C7144", light: "#E4CCA5", accent: "#5E4C2C" },
  trimWh:     { base: "#EDE9DD", mid: "#D8D2C0", dark: "#9C947B", light: "#F4F1E6", accent: "#6F684F" },
  adhesive:   { base: "#3C7CBE", mid: "#2A618F", dark: "#1E5277", light: "#5D9BD8", accent: "#FFDF6B" },
  underlay:   { base: "#7B8A5A", mid: "#5E6E40", dark: "#4E5A38", light: "#9AAE76", accent: "#3A4528" },
};

/** Pick the right palette key from a Northgate SKU. */
function paletteKey(sku: string): keyof typeof PALETTES {
  if (sku.includes("CARRARA"))  return "carrara";
  if (sku.includes("OAK-LVT"))  return "oakLvt";
  if (sku.includes("STORM"))    return "stormSpc";
  if (sku.includes("NATURAL"))  return "naturalLvt";
  if (sku.includes("MARBLE-GLS"))return "marbleGls";
  if (sku.includes("CHARCOAL")) return "charcoalMt";
  if (sku.includes("COPPER"))   return "copperMet";
  if (sku === "CL-CR-WHITE")    return "ceilingWh";
  if (sku === "CL-CR-OAK")      return "ceilingOak";
  if (sku.startsWith("TR-"))    return "trimWh";
  if (sku.startsWith("ADH-"))   return "adhesive";
  if (sku.startsWith("UND-"))   return "underlay";
  return "carrara";
}

interface Props {
  sku: string;
  category: string;
}

export function ProductImage({ sku, category }: Props) {
  const p = PALETTES[paletteKey(sku)];

  if (category === "Flooring")    return <Flooring p={p} sku={sku} />;
  if (category === "Wall panels") return <Panel    p={p} sku={sku} />;
  if (category === "Ceiling")     return <Ceiling  p={p} sku={sku} />;
  if (category === "Trims")       return <Trim     p={p} sku={sku} />;
  if (sku.startsWith("ADH-"))     return <Adhesive p={p} />;
  if (sku.startsWith("UND-"))     return <Underlay p={p} />;
  return <Flooring p={p} sku={sku} />;
}

/* ────────────────────── Flooring ────────────────────── */
function Flooring({ p, sku }: { p: Palette; sku: string }) {
  // Stone-tile look for the natural-stone SKU; everything else gets plank look.
  const isTile = sku.includes("NATURAL");
  return (
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
      <defs>
        <linearGradient id={`f-bg-${sku}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={p.light} />
          <stop offset="100%" stopColor={p.mid} />
        </linearGradient>
        <linearGradient id={`f-shine-${sku}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill={`url(#f-bg-${sku})`} />

      {/* Planks (perspective) */}
      {isTile ? (
        // 3×2 tile grid
        Array.from({ length: 6 }).map((_, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = col * 134 - 1;
          const y = row * 110 - 1;
          return (
            <g key={i}>
              <rect x={x} y={y} width={132} height={108} fill={p.base} stroke={p.dark} strokeWidth="0.6" />
              {/* speckle for stone */}
              <circle cx={x + 30 + (col*7)} cy={y + 28 + (row*9)} r="2.4" fill={p.dark} opacity="0.35" />
              <circle cx={x + 80 + (col*4)} cy={y + 60 + (row*5)} r="3.2" fill={p.accent} opacity="0.5" />
              <circle cx={x + 100 - (col*8)} cy={y + 30 + (row*11)} r="1.8" fill={p.dark} opacity="0.3" />
              <path
                d={`M${x + 10},${y + 80} Q${x + 40},${y + 70} ${x + 70},${y + 90} T${x + 130},${y + 75}`}
                stroke={p.accent}
                strokeWidth="0.7"
                fill="none"
                opacity="0.35"
              />
            </g>
          );
        })
      ) : (
        // 5 horizontal planks
        Array.from({ length: 5 }).map((_, i) => {
          const y = i * 44;
          const isMarble = sku.includes("CARRARA");
          return (
            <g key={i}>
              <rect x="0" y={y} width="400" height="44" fill={p.base} />
              <line x1="0" y1={y + 44} x2="400" y2={y + 44} stroke={p.dark} strokeWidth="0.7" opacity="0.55" />
              {/* plank end-joints offset per row */}
              <line x1={i % 2 ? 140 : 240} y1={y} x2={i % 2 ? 140 : 240} y2={y + 44} stroke={p.dark} strokeWidth="0.5" opacity="0.4" />
              <line x1={i % 2 ? 300 : 60}  y1={y} x2={i % 2 ? 300 : 60}  y2={y + 44} stroke={p.dark} strokeWidth="0.5" opacity="0.4" />

              {isMarble ? (
                // marble veining
                <>
                  <path d={`M0,${y + 12} Q80,${y + 22} 160,${y + 8} T400,${y + 18}`} stroke={p.accent} strokeWidth="0.9" fill="none" opacity="0.45" />
                  <path d={`M0,${y + 32} Q120,${y + 26} 240,${y + 36} T400,${y + 30}`} stroke={p.dark} strokeWidth="0.6" fill="none" opacity="0.35" />
                </>
              ) : (
                // wood grain
                <>
                  <path d={`M0,${y + 14} Q100,${y + 18} 200,${y + 14} T400,${y + 16}`} stroke={p.dark} strokeWidth="0.5" fill="none" opacity="0.4" />
                  <path d={`M0,${y + 28} Q80,${y + 24} 160,${y + 30} T400,${y + 26}`} stroke={p.dark} strokeWidth="0.5" fill="none" opacity="0.35" />
                  {/* knot */}
                  {i === 1 && <ellipse cx={210} cy={y + 22} rx="6" ry="3" fill={p.dark} opacity="0.4" />}
                  {i === 3 && <ellipse cx={310} cy={y + 22} rx="4" ry="2.4" fill={p.dark} opacity="0.4" />}
                </>
              )}
            </g>
          );
        })
      )}

      {/* top-left light wash */}
      <rect width="400" height="220" fill={`url(#f-shine-${sku})`} />
    </svg>
  );
}

/* ────────────────────── Wall panels ────────────────────── */
function Panel({ p, sku }: { p: Palette; sku: string }) {
  const isMarble = sku.includes("MARBLE");
  const isMetal  = sku.includes("COPPER");
  const PANELS = 3;
  return (
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
      <defs>
        <linearGradient id={`p-shine-${sku}`} x1="0" x2="1" y1="0" y2="0.4">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={isMetal ? "0.45" : "0.25"} />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`p-base-${sku}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={p.light} />
          <stop offset="100%" stopColor={p.mid} />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill={p.base} />

      {Array.from({ length: PANELS }).map((_, i) => {
        const w = 400 / PANELS;
        const x = i * w;
        return (
          <g key={i}>
            <rect x={x} y="0" width={w} height={220} fill={`url(#p-base-${sku})`} />
            {/* tongue-and-groove join */}
            <line x1={x + w} y1="0" x2={x + w} y2="220" stroke={p.dark} strokeWidth="1.2" opacity="0.55" />
            <line x1={x + w + 1} y1="0" x2={x + w + 1} y2="220" stroke={p.light} strokeWidth="0.6" opacity="0.6" />

            {isMarble && (
              <>
                <path d={`M${x + 12},0 Q${x + 40},80 ${x + 20},220`}  stroke={p.accent} strokeWidth="1.4" fill="none" opacity="0.55" />
                <path d={`M${x + 50},0 Q${x + 90},120 ${x + 60},220`} stroke={p.dark}   strokeWidth="0.9" fill="none" opacity="0.4" />
                <path d={`M${x + 105},0 Q${x + 80},110 ${x + 115},220`}stroke={p.accent} strokeWidth="0.8" fill="none" opacity="0.35" />
              </>
            )}

            {isMetal && (
              <>
                {/* metallic brushed lines */}
                {Array.from({ length: 9 }).map((_, k) => (
                  <line
                    key={k}
                    x1={x}
                    y1={k * 26 + 4}
                    x2={x + w}
                    y2={k * 26 + 4}
                    stroke={k % 2 ? p.accent : p.dark}
                    strokeWidth="0.4"
                    opacity={k % 2 ? 0.35 : 0.25}
                  />
                ))}
              </>
            )}

            {!isMarble && !isMetal && (
              // matt — subtle vertical texture
              Array.from({ length: 4 }).map((_, k) => (
                <line
                  key={k}
                  x1={x + 22 + k * 28}
                  y1="0"
                  x2={x + 22 + k * 28}
                  y2="220"
                  stroke={p.dark}
                  strokeWidth="0.3"
                  opacity="0.25"
                />
              ))
            )}
          </g>
        );
      })}

      <rect width="400" height="220" fill={`url(#p-shine-${sku})`} />
    </svg>
  );
}

/* ────────────────────── Ceiling ────────────────────── */
function Ceiling({ p, sku }: { p: Palette; sku: string }) {
  // Perspective ceiling looking up — vanishing point top-centre.
  return (
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
      <defs>
        <linearGradient id={`c-bg-${sku}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={p.dark} stopOpacity="0.7" />
          <stop offset="100%" stopColor={p.base} />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill={`url(#c-bg-${sku})`} />

      {/* perspective grid: 6 planks fanning out from a vanishing point */}
      {Array.from({ length: 7 }).map((_, i) => {
        const t = i / 6;
        // bottom corners
        const x1 = t * 400;
        // top vanishing-ish point (centre, slightly off)
        const x2 = 180 + (t - 0.5) * 60;
        return <line key={i} x1={x1} y1="220" x2={x2} y2="20" stroke={p.dark} strokeWidth="0.9" opacity="0.65" />;
      })}

      {/* horizontal courses */}
      {[40, 80, 130, 185].map((y, i) => (
        <g key={i}>
          <line x1="0" y1={y} x2="400" y2={y} stroke={p.dark} strokeWidth="0.5" opacity="0.4" />
          {/* slight wood-grain wash for oak version */}
          {sku === "CL-CR-OAK" && (
            <path d={`M0,${y - 8} Q150,${y - 14} 300,${y - 6} T400,${y - 10}`} stroke={p.accent} strokeWidth="0.5" fill="none" opacity="0.45" />
          )}
        </g>
      ))}

      {/* light leak */}
      <ellipse cx="200" cy="40" rx="160" ry="40" fill="#ffffff" opacity="0.16" />
    </svg>
  );
}

/* ────────────────────── Trim ────────────────────── */
function Trim({ p, sku }: { p: Palette; sku: string }) {
  // Single trim length viewed at an angle, with end-cap detail.
  const isCorner = sku.includes("CC");
  const isSkirt  = sku.includes("SK");
  return (
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
      <defs>
        <linearGradient id={`t-bg-${sku}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#FAFAF7" />
          <stop offset="100%" stopColor="#EFEDE3" />
        </linearGradient>
        <linearGradient id={`t-body-${sku}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={p.light} />
          <stop offset="60%" stopColor={p.base} />
          <stop offset="100%" stopColor={p.dark} />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill={`url(#t-bg-${sku})`} />

      {isCorner ? (
        // L-shaped corner trim, perspective
        <>
          <polygon points="80,150 360,80 360,118 80,188" fill={`url(#t-body-${sku})`} stroke={p.dark} strokeWidth="0.8" />
          <polygon points="80,150 80,188 50,180 50,142" fill={p.dark} opacity="0.4" />
          <line x1="80" y1="169" x2="360" y2="99" stroke={p.accent} strokeWidth="0.5" opacity="0.5" />
        </>
      ) : isSkirt ? (
        // Skirting profile
        <>
          <polygon points="40,160 360,90 360,160 40,180" fill={`url(#t-body-${sku})`} stroke={p.dark} strokeWidth="0.8" />
          <polygon points="40,160 360,90 360,80 50,150" fill={p.light} opacity="0.5" />
          <polygon points="40,180 40,160 50,150 50,170" fill={p.dark} opacity="0.4" />
        </>
      ) : (
        // End trim (slim rectangle profile)
        <>
          <polygon points="60,130 350,80 350,110 60,160" fill={`url(#t-body-${sku})`} stroke={p.dark} strokeWidth="0.8" />
          <polygon points="60,130 60,160 40,152 40,122" fill={p.dark} opacity="0.4" />
          <line x1="60" y1="145" x2="350" y2="95" stroke={p.light} strokeWidth="0.6" opacity="0.8" />
        </>
      )}

      {/* shadow under trim */}
      <ellipse cx="220" cy="200" rx="180" ry="6" fill={p.dark} opacity="0.18" />
    </svg>
  );
}

/* ────────────────────── Adhesive tub ────────────────────── */
function Adhesive({ p }: { p: Palette }) {
  return (
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
      <defs>
        <linearGradient id="a-bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#F4F3EF" />
          <stop offset="100%" stopColor="#E7E5DE" />
        </linearGradient>
        <linearGradient id="a-tub" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={p.dark} />
          <stop offset="50%" stopColor={p.base} />
          <stop offset="100%" stopColor={p.dark} />
        </linearGradient>
        <linearGradient id="a-lid" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={p.light} />
          <stop offset="100%" stopColor={p.mid} />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#a-bg)" />

      {/* tub body */}
      <path d="M140,80 L260,80 L268,200 L132,200 Z" fill="url(#a-tub)" stroke={p.dark} strokeWidth="1" />
      {/* lid (ellipse top) */}
      <ellipse cx="200" cy="80" rx="60" ry="10" fill="url(#a-lid)" stroke={p.dark} strokeWidth="1" />
      {/* handle */}
      <path d="M150,80 Q200,30 250,80" fill="none" stroke={p.dark} strokeWidth="3" strokeLinecap="round" />
      {/* label */}
      <rect x="148" y="115" width="104" height="60" rx="4" fill={p.accent} opacity="0.95" />
      <rect x="155" y="125" width="90" height="6" rx="2" fill={p.dark} opacity="0.8" />
      <rect x="155" y="138" width="62" height="4" rx="1" fill={p.dark} opacity="0.5" />
      <rect x="155" y="147" width="80" height="4" rx="1" fill={p.dark} opacity="0.5" />
      <rect x="155" y="160" width="30" height="10" rx="2" fill={p.dark} opacity="0.7" />

      {/* shadow */}
      <ellipse cx="200" cy="208" rx="90" ry="5" fill={p.dark} opacity="0.25" />
    </svg>
  );
}

/* ────────────────────── Underlay roll ────────────────────── */
function Underlay({ p }: { p: Palette }) {
  return (
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
      <defs>
        <linearGradient id="u-bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#F4F3EF" />
          <stop offset="100%" stopColor="#E7E5DE" />
        </linearGradient>
        <linearGradient id="u-roll" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={p.dark} />
          <stop offset="50%" stopColor={p.base} />
          <stop offset="100%" stopColor={p.dark} />
        </linearGradient>
        <radialGradient id="u-end" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor={p.light} />
          <stop offset="50%" stopColor={p.base} />
          <stop offset="100%" stopColor={p.dark} />
        </radialGradient>
      </defs>
      <rect width="400" height="220" fill="url(#u-bg)" />

      {/* Rolled material body */}
      <rect x="120" y="80" width="180" height="100" fill="url(#u-roll)" />
      {/* Wrap lines */}
      {[100, 130, 160].map((y, i) => (
        <line key={i} x1="120" y1={y} x2="300" y2={y} stroke={p.dark} strokeWidth="0.5" opacity="0.4" />
      ))}
      {/* Left circular end */}
      <ellipse cx="120" cy="130" rx="22" ry="50" fill="url(#u-end)" stroke={p.dark} strokeWidth="0.8" />
      <ellipse cx="120" cy="130" rx="12" ry="28" fill={p.accent} opacity="0.55" />
      <circle  cx="120" cy="130" r="3" fill={p.dark} />
      {/* Right circular end (back) */}
      <ellipse cx="300" cy="130" rx="22" ry="50" fill="url(#u-end)" stroke={p.dark} strokeWidth="0.8" />

      {/* loose flap on top hinting at material */}
      <path d="M300,80 Q345,95 360,130 Q355,140 340,138 Q325,118 300,108 Z" fill={p.mid} stroke={p.dark} strokeWidth="0.7" />

      {/* shadow */}
      <ellipse cx="200" cy="200" rx="120" ry="6" fill={p.dark} opacity="0.2" />
    </svg>
  );
}
