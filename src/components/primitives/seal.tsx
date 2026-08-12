"use client";

import { cn } from "@/lib/utils";

/**
 * Seal — the signature verification mark for the Registry design system.
 *
 * A circular stamp motif with ring text and a checkmark center.
 * Uses stamp-green for verified/success states, registry for neutral/official.
 * Plays the `stamp-in` keyframe on mount (one-shot entrance animation).
 *
 * Per §3.2 of the Interface Overhaul Brief:
 * "Build one real, custom SVG verification seal — a circular stamp motif with
 * ring text and a checkmark or star center, in stamp-green for verified/success
 * states and registry for neutral/official states — and use it everywhere the
 * product currently uses a generic checkmark badge."
 */

export interface SealProps {
  /** Size in pixels (default: 20) */
  size?: number;
  /** Color variant: stamp-green for verified/success, registry for official/neutral */
  variant?: "verified" | "official";
  /** Text around the ring (default: "VERIFIED") */
  ringText?: string;
  /** Whether to play the stamp-in entrance animation on mount (default: true) */
  animated?: boolean;
  className?: string;
}

export function Seal({
  size = 20,
  variant = "verified",
  ringText = "VERIFIED",
  animated = true,
  className,
}: SealProps) {
  const color = variant === "verified" ? "var(--stamp-green)" : "var(--registry)";
  const colorFill = variant === "verified" ? "var(--stamp-tint)" : "rgba(30, 58, 95, 0.08)";

  // Unique ID for the textPath so multiple seals on the same page don't conflict
  const pathId = `seal-ring-${variant}-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(animated && "stamp-in", className)}
      aria-label={variant === "verified" ? "Tasdiqlangan" : "Rasmiy"}
      role="img"
    >
      {/* Outer ring */}
      <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="2" fill={colorFill} />

      {/* Inner ring */}
      <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="1" fill="none" opacity="0.5" />

      {/* Ring text path (invisible path for text to follow) */}
      <defs>
        <path id={pathId} d="M 50,50 m -32,0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0" />
      </defs>

      {/* Ring text */}
      <text fill={color} fontSize="7" fontWeight="600" letterSpacing="1.5" fontFamily="var(--font-mono), monospace">
        <textPath href={`#${pathId}`} startOffset="0">
          {ringText} · {ringText} ·
        </textPath>
      </text>

      {/* Center checkmark */}
      <path
        d="M 38,50 L 46,58 L 62,42"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
