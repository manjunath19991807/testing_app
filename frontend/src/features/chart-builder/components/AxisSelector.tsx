type AxisSelectorProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

export function AxisSelector({ label, value, options, onChange }: AxisSelectorProps) {
  return (
    <label className="stack" style={{ gap: 8 }}>
      <span style={{ fontWeight: 700 }}>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={fieldStyle}
      >
        {options.length === 0 ? (
          <option value="">No columns available</option>
        ) : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

const fieldStyle = {
  padding: "12px 14px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border)",
  background: "white"
} as const;
