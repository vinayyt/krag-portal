"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "./icon";

interface ToastProps {
  message: string | null;
  onDismiss?: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fade-up"
      style={{
        position: "fixed",
        bottom: 28,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 200,
        background: "var(--ink)",
        color: "var(--surface)",
        padding: "13px 22px",
        borderRadius: 999,
        fontSize: 14.5,
        fontWeight: 600,
        boxShadow: "var(--shadow-lg)",
        display: visible ? "flex" : "none",
        alignItems: "center",
        gap: 10,
        whiteSpace: "nowrap",
      }}
    >
      <Icon name="checkCircle" size={18} />
      {message}
    </div>
  );
}
