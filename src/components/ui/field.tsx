"use client";

import React, { useState } from "react";
import { Icon } from "./icon";

interface FieldProps {
  label?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: string;
  hint?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
  id?: string;
  name?: string;
}

export function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  hint,
  required,
  autoComplete,
  inputMode,
  id,
  name,
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const fieldId = id || name || Math.random().toString(36).slice(2);

  return (
    <div>
      {label && (
        <label
          htmlFor={fieldId}
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--ink-2)",
            marginBottom: 7,
          }}
        >
          {label}
          {required && <span aria-hidden="true" style={{ color: "var(--accent)", marginLeft: 3 }}>*</span>}
        </label>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 14px",
          height: 50,
          background: "var(--surface)",
          borderRadius: 12,
          border: `1.5px solid ${focused ? "var(--primary)" : "var(--line)"}`,
          boxShadow: focused ? "0 0 0 3px var(--accent-soft)" : "none",
          transition: "border-color .15s, box-shadow .15s",
        }}
      >
        {icon && (
          <Icon name={icon} size={18} style={{ color: "var(--ink-3)", flexShrink: 0 }} />
        )}
        <input
          id={fieldId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 15,
            color: "var(--ink)",
            minWidth: 0,
          }}
        />
      </div>
      {hint && (
        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 6 }}>{hint}</div>
      )}
    </div>
  );
}

interface TextareaFieldProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  id?: string;
  name?: string;
}

export function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  id,
  name,
}: TextareaFieldProps) {
  const [focused, setFocused] = useState(false);
  const fieldId = id || name || Math.random().toString(36).slice(2);

  return (
    <div>
      {label && (
        <label
          htmlFor={fieldId}
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--ink-2)",
            marginBottom: 7,
          }}
        >
          {label}
        </label>
      )}
      <textarea
        id={fieldId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "12px 14px",
          background: "var(--surface)",
          borderRadius: 12,
          border: `1.5px solid ${focused ? "var(--primary)" : "var(--line)"}`,
          boxShadow: focused ? "0 0 0 3px var(--accent-soft)" : "none",
          fontSize: 15,
          color: "var(--ink)",
          resize: "vertical",
          outline: "none",
          fontFamily: "inherit",
          transition: "border-color .15s, box-shadow .15s",
        }}
      />
    </div>
  );
}
