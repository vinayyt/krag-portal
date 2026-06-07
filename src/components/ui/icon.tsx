"use client";

import React from "react";

const ICONS: Record<string, string> = {
  home: "M3 11.5 12 4l9 7.5M5 10v10h5v-6h4v6h5V10",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  activity: "M3 12h4l2 6 4-14 2 8h6",
  cube: "M12 3 21 8v8l-9 5-9-5V8zM3 8l9 5 9-5M12 13v8",
  swatch: "M4 16a4 4 0 1 0 8 0V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1zM4 14h4M20 8l-8 8M16 4h4a1 1 0 0 1 1 1v4",
  wallet: "M3 7a2 2 0 0 1 2-2h12v3M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-3M3 7h16a1 1 0 0 1 1 1v3M17 12h.01",
  doc: "M6 2h8l4 4v16H6zM14 2v4h4M9 13h6M9 17h6M9 9h2",
  chat: "M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z",
  photo: "M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M16 9.5a1.5 1.5 0 1 0 0-.001",
  calendar: "M4 6h16v15H4zM4 10h16M8 3v4M16 3v4",
  settings: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19.4 13a7.7 7.7 0 0 0 0-2l2-1.5-2-3.5-2.4 1a7.7 7.7 0 0 0-1.7-1L15 3H9l-.3 2.5a7.7 7.7 0 0 0-1.7 1l-2.4-1-2 3.5L4.6 11a7.7 7.7 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7.7 7.7 0 0 0 1.7 1L9 21h6l.3-2.5a7.7 7.7 0 0 0 1.7-1l2.4 1 2-3.5z",
  bell: "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  check: "M5 13l4 4L19 7",
  checkCircle: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 12l3 3 5-5",
  chevR: "M9 6l6 6-6 6",
  chevD: "M6 9l6 6 6-6",
  chevL: "M15 6l-6 6 6 6",
  arrowR: "M5 12h14M13 6l6 6-6 6",
  plus: "M12 5v14M5 12h14",
  star: "M12 3l2.7 5.8 6.3.8-4.7 4.3 1.3 6.3L12 17.8 6.1 20.5l1.3-6.3L2.7 9.6l6.3-.8z",
  pin: "M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  people: "M16 19v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM22 19v-2a4 4 0 0 0-3-3.8M16 2.2A3.5 3.5 0 0 1 16 9",
  bed: "M3 18V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10M3 14h18M7 11h4M3 18v2M21 18v2",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 7v5l3 2",
  camera: "M3 8a2 2 0 0 1 2-2h2l1.5-2h7L19 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  phone: "M5 3h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  tools: "M14 7a3.5 3.5 0 0 1-4.6 4.6L4 17v3h3l5.4-5.4A3.5 3.5 0 0 1 17 10l4-4-3-3z",
  hammer: "M14 7l5-5 3 3-5 5-3-3zM14 7l-9 9 3 3 9-9M5 16l-2 2 3 3 2-2",
  x: "M6 6l12 12M18 6L6 18",
  menu: "M4 7h16M4 12h16M4 17h16",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z",
  send: "M4 12l16-8-6 16-2.5-6.5zM10 13.5L20 4",
  lock: "M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  wave: "M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0M2 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0",
  tree: "M12 3l5 7h-3l4 6h-5v5h-2v-5H6l4-6H7z",
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19",
  ruler: "M3 9h18v6H3zM7 9v3M11 9v3M15 9v3M19 9v3",
  download: "M12 3v12M7 11l5 5 5-5M5 21h14",
  signature: "M3 17c3 0 3-8 6-8s2 6 5 6 2-4 4-4M3 21h18",
  logout: "M16 17l5-5-5-5M21 12H9M12 3H5v18h7",
  filter: "M3 5h18l-7 8v6l-4-2v-4z",
  play: "M6 4l14 8-14 8z",
  expand: "M4 9V4h5M20 15v5h-5M15 4h5v5M9 20H4v-5",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
  heart: "M12 20s-7-4.3-9.3-8.5A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5.5C19 15.7 12 20 12 20z",
  briefcase: "M3 8h18v12H3zM8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18",
  shield: "M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z",
  leaf: "M5 19c0-8 6-13 14-13 0 8-5 14-13 14-1 0-1-1-1-1zM5 19c2-3 5-5 8-6",
  video: "M3 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM15 10l6-3v10l-6-3",
  building: "M4 21V4h10v17M14 9h6v12M7 8h1M7 12h1M7 16h1M11 8h1M11 12h1M11 16h1M17 13h1M17 17h1",
};

interface IconProps {
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  fill?: string;
  "aria-label"?: string;
}

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.7,
  className = "",
  style = {},
  fill = "none",
  "aria-label": ariaLabel,
}: IconProps) {
  const d = ICONS[name];
  if (!d) return null;

  const paths = d
    .split("M")
    .filter(Boolean)
    .map((seg, i) => <path key={i} d={"M" + seg} />);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      className={className}
      style={{ flexShrink: 0, ...style }}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={ariaLabel ? undefined : "true"}
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : undefined}
    >
      {paths}
    </svg>
  );
}
