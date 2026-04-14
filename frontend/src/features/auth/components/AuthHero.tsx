type AuthHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
};

export function AuthHero({ eyebrow, title, description, bullets }: AuthHeroProps) {
  return (
    <section className="hero-card" style={{ display: "grid", alignContent: "space-between", gap: 24 }}>
      <div className="stack">
        <span className="badge">{eyebrow}</span>
        <h1 style={{ margin: 0, fontSize: "2.4rem", lineHeight: 1.05 }}>{title}</h1>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>{description}</p>
      </div>
      <div className="stack">
        {bullets.map((bullet) => (
          <div
            key={bullet}
            style={{
              padding: 18,
              borderRadius: "var(--radius-md)",
              background: "rgba(255,255,255,0.56)",
              border: "1px solid var(--border)"
            }}
          >
            {bullet}
          </div>
        ))}
      </div>
    </section>
  );
}
