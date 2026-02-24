/**
 * BirdBackground — Pure CSS animated bird silhouettes for Hey Kerala.
 *
 * Performance contract:
 *  • No useState / useEffect / JS animation loops.
 *  • Animates only transform + opacity → compositor-only, GPU-accelerated.
 *  • will-change: transform applied per bird.
 *  • pointer-events: none — never blocks clicks.
 *  • prefers-reduced-motion: birds hidden entirely.
 *  • No layout shift: position absolute, overflow hidden wrapper.
 */

import React, { memo } from "react";

/* ───────────────────────────────────────────────────────────────
   Inline SVG bird silhouette – a minimal Kerala-style soaring bird.
   Drawn at ~48×20 px natural size; scaled via CSS.
─────────────────────────────────────────────────────────────── */
const BirdSVG = memo(({ className }: { className?: string }) => (
    <svg
        className={className}
        viewBox="0 0 48 20"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
        fill="currentColor"
    >
        {/*
      Two wing arcs meeting at the body centre — classic seagull silhouette.
      Paths traced to stay ultra-lightweight (no strokes, pure fills).
    */}
        <path d="M24 10 C18 2, 8 0, 0 4 C8 5, 16 8, 24 10Z" />
        <path d="M24 10 C30 2, 40 0, 48 4 C40 5, 32 8, 24 10Z" />
    </svg>
));
BirdSVG.displayName = "BirdSVG";

/* ───────────────────────────────────────────────────────────────
   Bird config — each entry drives a unique CSS animation lane.
   Values kept as inline styles so Tailwind purge never strips them.
─────────────────────────────────────────────────────────────── */
interface BirdConfig {
    /** Vertical start position as % of container height */
    top: string;
    /** Width of SVG (controls apparent size / distance) */
    size: string;
    /** Total animation duration */
    duration: string;
    /** Stagger delay so birds don't all start together */
    delay: string;
    /** Slight vertical drift range for a realistic glide */
    driftY: string;
    /** Opacity — distant birds appear more translucent */
    opacity: number;
    /** Scale — distant birds appear smaller */
    scale: string;
}

const BIRDS: BirdConfig[] = [
    // Large / near birds
    { top: "8%", size: "52px", duration: "28s", delay: "0s", driftY: "-12px", opacity: 0.18, scale: "1" },
    { top: "14%", size: "44px", duration: "34s", delay: "5s", driftY: "10px", opacity: 0.15, scale: "1" },
    { top: "22%", size: "36px", duration: "38s", delay: "12s", driftY: "-8px", opacity: 0.13, scale: "0.9" },
    // Mid-distance birds
    { top: "30%", size: "28px", duration: "32s", delay: "3s", driftY: "6px", opacity: 0.11, scale: "0.8" },
    { top: "18%", size: "24px", duration: "42s", delay: "18s", driftY: "-10px", opacity: 0.10, scale: "0.75" },
    { top: "40%", size: "22px", duration: "36s", delay: "8s", driftY: "8px", opacity: 0.09, scale: "0.7" },
    // Small / distant birds (flock feel)
    { top: "10%", size: "18px", duration: "44s", delay: "22s", driftY: "-6px", opacity: 0.08, scale: "0.65" },
    { top: "26%", size: "16px", duration: "30s", delay: "15s", driftY: "4px", opacity: 0.08, scale: "0.6" },
    { top: "35%", size: "14px", duration: "48s", delay: "27s", driftY: "-5px", opacity: 0.07, scale: "0.55" },
    { top: "20%", size: "12px", duration: "40s", delay: "33s", driftY: "3px", opacity: 0.06, scale: "0.5" },
    // Extra tiny specks for depth
    { top: "12%", size: "10px", duration: "52s", delay: "9s", driftY: "-4px", opacity: 0.06, scale: "0.45" },
    { top: "45%", size: "9px", duration: "35s", delay: "20s", driftY: "5px", opacity: 0.05, scale: "0.4" },
];

/* ───────────────────────────────────────────────────────────────
   Component
─────────────────────────────────────────────────────────────── */
const BirdBackground = memo(() => {
    return (
        <div
            aria-hidden="true"
            style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                pointerEvents: "none",
                zIndex: 0,
                // Contain compositing to this subtree
                isolation: "isolate",
            }}
        >
            {BIRDS.map((bird, i) => (
                <span
                    key={i}
                    className="bird-fly"
                    style={{
                        // Position
                        position: "absolute",
                        top: bird.top,
                        left: "-60px", // start just off-screen left
                        // Size
                        width: bird.size,
                        height: "auto",
                        // Visual
                        color: "currentColor",
                        opacity: bird.opacity,
                        transform: `scale(${bird.scale})`,
                        transformOrigin: "left center",
                        // GPU hint
                        willChange: "transform",
                        // Animation — unique per bird via CSS custom props
                        animationName: "birdFly",
                        animationTimingFunction: "linear",
                        animationIterationCount: "infinite",
                        animationDuration: bird.duration,
                        animationDelay: bird.delay,
                        // Drift uses a secondary animation per driftY value
                        // Baked into the keyframe via a CSS variable trick: we encode
                        // driftY as an inline var so the shared keyframe still reads it.
                        ["--bird-drift" as string]: bird.driftY,
                    } as React.CSSProperties}
                >
                    <BirdSVG />
                </span>
            ))}
        </div>
    );
});
BirdBackground.displayName = "BirdBackground";

export default BirdBackground;
