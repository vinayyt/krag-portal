import React from "react";
import { Icon } from "./icon";

type ImageTone =
  | "fjord"
  | "forest"
  | "sand"
  | "indoor"
  | "frame"
  | "wood"
  | "ground"
  | "render";

const IMG_TONES: Record<ImageTone, [string, string, string]> = {
  fjord:   ["#9fb4bd", "#6f8a96", "wave"],
  forest:  ["#8a9b78", "#5d6e4e", "tree"],
  sand:    ["#cdba9c", "#a8916f", "sun"],
  indoor:  ["#c9bda9", "#9c8b73", "home"],
  frame:   ["#b6a78f", "#8a7a60", "building"],
  wood:    ["#c0a079", "#94764f", "layers"],
  ground:  ["#b0a48f", "#857a64", "ruler"],
  render:  ["#b7ada0", "#8c8270", "cube"],
};

interface ImageBoxProps {
  tone?: ImageTone;
  label?: string;
  ratio?: string;
  radius?: string;
  icon?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  badge?: string | number;
  className?: string;
}

export function ImageBox({
  tone = "render",
  label,
  ratio = "16/10",
  radius = "var(--radius-sm)",
  icon,
  style = {},
  children,
  badge,
  className = "",
}: ImageBoxProps) {
  const [c1, c2, ic] = IMG_TONES[tone] || IMG_TONES.render;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: ratio,
        borderRadius: radius,
        overflow: "hidden",
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        ...style,
      }}
      aria-label={label || "Image placeholder"}
    >
      {/* Diagonal stripe texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.5,
          mixBlendMode: "soft-light",
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,.5) 0 1px, transparent 1px 11px)",
        }}
      />
      {/* Radial highlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.35,
          backgroundImage:
            "radial-gradient(circle at 30% 25%, rgba(255,255,255,.5), transparent 45%)",
        }}
      />
      {/* Center icon + label */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          color: "rgba(255,255,255,.92)",
        }}
      >
        <Icon
          name={icon || ic}
          size={26}
          strokeWidth={1.5}
          style={{ opacity: 0.9, filter: "drop-shadow(0 1px 2px rgba(0,0,0,.2))" }}
        />
        {label && (
          <span
            className="mono"
            style={{
              fontSize: 10.5,
              letterSpacing: ".06em",
              textTransform: "uppercase",
              opacity: 0.92,
              textShadow: "0 1px 2px rgba(0,0,0,.25)",
              padding: "0 10px",
              textAlign: "center",
            }}
          >
            {label}
          </span>
        )}
      </div>
      {/* Photo count badge */}
      {badge !== undefined && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            background: "rgba(20,18,14,.62)",
            color: "#fff",
            borderRadius: 999,
            padding: "4px 10px",
            fontSize: 12,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 5,
            backdropFilter: "blur(4px)",
          }}
        >
          <Icon name="camera" size={13} />
          {badge}
        </div>
      )}
      {children}
    </div>
  );
}
