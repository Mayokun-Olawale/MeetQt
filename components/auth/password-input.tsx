"use client";

import { useState } from "react";

type PasswordInputProps = {
  id: string;
  name: string;
  autoComplete: string;
  required?: boolean;
  minLength?: number;
};

function EyeIcon({ hidden }: { hidden: boolean }) {
  return hidden ? (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.7 10.7 0 0 1 12 4c5.5 0 9.5 5 9.5 5s-1.2 1.5-3.2 3.1M6.2 6.2C3.9 7.7 2.5 9 2.5 9S6.5 14 12 14c1 0 1.9-.2 2.8-.5" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2.5 9S6.5 4 12 4s9.5 5 9.5 5-4 5-9.5 5-9.5-5-9.5-5Z" />
      <circle cx="12" cy="9" r="2" />
    </svg>
  );
}

export function PasswordInput({
  id,
  name,
  autoComplete,
  required,
  minLength,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <span>
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
      >
        <EyeIcon hidden={visible} />
      </button>
    </span>
  );
}
