import { ReactNode } from "react";

type CardProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

export function Card({ title, subtitle, children }: CardProps) {
  return (
    <section
      style={{
        background: "var(--surface-strong)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border)",
        padding: 20,
        boxShadow: "var(--shadow-card)"
      }}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: 16 }}>
          {title && <h3 style={{ margin: "0 0 6px" }}>{title}</h3>}
          {subtitle && (
            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.5 }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
