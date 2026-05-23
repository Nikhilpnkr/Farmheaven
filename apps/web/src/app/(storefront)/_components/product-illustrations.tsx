/**
 * Shared inline SVG product illustrations for the storefront.
 * Imported by both / (Today's harvest) and /shop (full catalogue) so
 * the same visual vocabulary carries across pages. All zero-JS, SSR
 * inline — no extra asset requests, no extra bundle.
 *
 * Design rules:
 *  - One stroke colour per illustration. Use Tailwind text-* on the
 *    container; the SVG uses currentColor. Caller decides contrast.
 *  - viewBox is always 100x100 (or wider for cluster compositions).
 *    Caller controls render size via width/height props or just lets
 *    the parent flex container size it.
 *  - <title> on every <svg> for screen-reader naming. aria-hidden
 *    when purely decorative.
 */

export function MilkBottleIllustration() {
  return (
    <svg viewBox="0 0 100 100" width="90" height="90" className="text-emerald-900">
      <title>Milk bottle</title>
      <rect
        x="42"
        y="14"
        width="16"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
      />
      <path
        d="M44 22 L44 30 L36 38 L36 82 Q36 88 42 88 L58 88 Q64 88 64 82 L64 38 L56 30 L56 22"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="white"
        strokeLinejoin="round"
      />
      <line
        x1="38"
        y1="62"
        x2="62"
        y2="62"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

export function GheeJarIllustration() {
  return (
    <svg viewBox="0 0 100 100" width="92" height="92" className="text-emerald-900">
      <title>Ghee jar</title>
      <rect
        x="30"
        y="16"
        width="40"
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
      />
      <path
        d="M34 25 L34 82 Q34 90 42 90 L58 90 Q66 90 66 82 L66 25"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="rgba(255,255,255,0.6)"
        strokeLinejoin="round"
      />
      <path d="M34 42 Q50 37 66 42" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function EggsIllustration() {
  return (
    <svg viewBox="0 0 120 100" width="100" height="84" className="text-amber-50">
      <title>Three eggs</title>
      <ellipse cx="40" cy="60" rx="13" ry="17" fill="currentColor" opacity="0.92" />
      <ellipse cx="80" cy="60" rx="13" ry="17" fill="currentColor" opacity="0.92" />
      <ellipse cx="60" cy="50" rx="14" ry="18" fill="currentColor" />
      <ellipse cx="36" cy="52" rx="2.5" ry="3.5" fill="white" opacity="0.5" />
      <ellipse cx="76" cy="52" rx="2.5" ry="3.5" fill="white" opacity="0.5" />
      <ellipse cx="56" cy="42" rx="3" ry="4" fill="white" opacity="0.5" />
    </svg>
  );
}

export function PalakIllustration() {
  return (
    <svg viewBox="0 0 100 100" width="92" height="92" className="text-yellow-50">
      <title>Spinach leaves</title>
      <path d="M50 80 Q35 60 40 35 Q55 28 62 50 Q60 72 50 80 Z" fill="currentColor" opacity="0.7" />
      <path d="M55 85 Q40 70 38 42 Q56 32 72 52 Q68 78 55 85 Z" fill="currentColor" />
      <line
        x1="55"
        y1="85"
        x2="55"
        y2="40"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="80"
        x2="50"
        y2="40"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CurdPotIllustration() {
  return (
    <svg viewBox="0 0 100 100" width="90" height="90" className="text-emerald-900">
      <title>Curd pot</title>
      {/* Wide-mouth pot — squat with rim */}
      <ellipse cx="50" cy="28" rx="22" ry="4" fill="currentColor" />
      <path
        d="M28 28 Q26 60 32 80 Q36 88 50 88 Q64 88 68 80 Q74 60 72 28"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="white"
        strokeLinejoin="round"
      />
      {/* Curd surface */}
      <ellipse cx="50" cy="32" rx="20" ry="3" fill="rgba(255,255,255,0.95)" />
      <ellipse
        cx="50"
        cy="32"
        rx="14"
        ry="2"
        fill="white"
        stroke="currentColor"
        strokeWidth="0.8"
      />
    </svg>
  );
}

export function PaneerBlockIllustration() {
  return (
    <svg viewBox="0 0 100 100" width="88" height="88" className="text-emerald-900">
      <title>Paneer block</title>
      {/* Cuboid block with isometric depth */}
      <path d="M20 40 L50 26 L80 40 L50 54 Z" fill="white" stroke="currentColor" strokeWidth="2" />
      <path
        d="M20 40 L20 76 L50 90 L50 54 Z"
        fill="rgba(255,255,255,0.9)"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M50 54 L50 90 L80 76 L80 40 Z"
        fill="rgba(255,255,255,0.7)"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Subtle grid lines on the top face */}
      <line x1="35" y1="33" x2="65" y2="47" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <line x1="50" y1="26" x2="50" y2="54" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
    </svg>
  );
}

export function TomatoesIllustration() {
  return (
    <svg viewBox="0 0 120 100" width="100" height="84" className="text-red-600">
      <title>Tomatoes</title>
      {/* Three round tomatoes */}
      <circle cx="40" cy="58" r="18" fill="currentColor" opacity="0.95" />
      <circle cx="80" cy="58" r="18" fill="currentColor" opacity="0.95" />
      <circle cx="60" cy="44" r="20" fill="currentColor" />
      {/* Stems / sepals */}
      <path d="M60 24 L58 30 L62 30 Z" fill="rgb(34, 90, 30)" />
      <path d="M60 24 L55 28 L60 30 L65 28 Z" fill="rgb(60, 130, 50)" />
      {/* Highlights */}
      <ellipse cx="54" cy="38" rx="3" ry="4" fill="white" opacity="0.4" />
      <ellipse cx="35" cy="52" rx="2.5" ry="3.5" fill="white" opacity="0.4" />
      <ellipse cx="75" cy="52" rx="2.5" ry="3.5" fill="white" opacity="0.4" />
    </svg>
  );
}

export function HoneyJarIllustration() {
  return (
    <svg viewBox="0 0 100 100" width="90" height="90" className="text-emerald-900">
      <title>Honey jar</title>
      {/* Hex-screw lid */}
      <path
        d="M34 18 L36 14 L64 14 L66 18 L64 24 L36 24 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
      />
      {/* Jar body, honey amber fill */}
      <path
        d="M30 24 L30 84 Q30 90 36 90 L64 90 Q70 90 70 84 L70 24"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="#E0A53A"
        strokeLinejoin="round"
      />
      {/* Drip detail */}
      <path d="M48 28 Q50 38 48 48" stroke="rgba(255,255,255,0.45)" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function MethiIllustration() {
  return (
    <svg viewBox="0 0 100 100" width="92" height="92" className="text-yellow-50">
      <title>Methi leaves</title>
      {/* Trio of small trifoliate leaves */}
      <g fill="currentColor">
        <ellipse cx="35" cy="50" rx="7" ry="11" transform="rotate(-30 35 50)" />
        <ellipse cx="50" cy="42" rx="7" ry="11" />
        <ellipse cx="65" cy="50" rx="7" ry="11" transform="rotate(30 65 50)" />
      </g>
      <g fill="currentColor" opacity="0.75">
        <ellipse cx="42" cy="72" rx="6" ry="9" transform="rotate(-30 42 72)" />
        <ellipse cx="55" cy="65" rx="6" ry="9" />
        <ellipse cx="68" cy="72" rx="6" ry="9" transform="rotate(30 68 72)" />
      </g>
      {/* Stems */}
      <line
        x1="50"
        y1="42"
        x2="50"
        y2="88"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BananaIllustration() {
  return (
    <svg viewBox="0 0 100 100" width="92" height="92" className="text-yellow-100">
      <title>Bananas</title>
      {/* Bunch — three crescent shapes nested */}
      <path
        d="M28 38 Q22 60 38 78 Q56 86 78 76 Q92 64 86 50 Q72 54 56 58 Q40 60 28 38 Z"
        fill="currentColor"
      />
      <path
        d="M30 32 Q28 56 42 72 Q60 80 80 70"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Stem */}
      <path
        d="M24 36 L18 28 L22 22"
        stroke="rgb(80, 60, 20)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
