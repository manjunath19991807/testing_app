type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div
      style={{
        padding: 24,
        borderRadius: "var(--radius-md)",
        border: "1px dashed var(--border)",
        background: "rgba(255,255,255,0.5)"
      }}
    >
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p style={{ marginBottom: 0, color: "var(--muted)" }}>{message}</p>
    </div>
  );
}

