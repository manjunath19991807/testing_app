import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  variant = "primary",
  style,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        border: "none",
        borderRadius: "999px",
        padding: "12px 18px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 700,
        background:
          variant === "primary" ? "linear-gradient(135deg, var(--primary), var(--primary-strong))" : "white",
        color: variant === "primary" ? "white" : "var(--text)",
        boxShadow: variant === "primary" ? "var(--shadow-card)" : "none",
        opacity: disabled ? 0.6 : 1,
        transition: "opacity 0.2s",
        ...style
      }}
    />
  );
}
