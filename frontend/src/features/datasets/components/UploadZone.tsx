import { ChangeEvent, useRef } from "react";
import { Button } from "../../../components/ui/Button";

type UploadZoneProps = {
  onSelectFile: (file: File) => void;
  isUploading: boolean;
};

export function UploadZone({ onSelectFile, isUploading }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleChooseClick() {
    inputRef.current?.click();
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      onSelectFile(selectedFile);
    }
  }

  return (
    <div
      style={{
        marginTop: 18,
        padding: 20,
        borderRadius: "var(--radius-md)",
        border: "1px dashed var(--border)",
        background: "rgba(255,255,255,0.46)"
      }}
    >
      <div className="stack">
        <strong>Drop your CSV here or click to browse</strong>
        <span className="muted">Upload a real `.csv` file and the backend will infer column names and types.</span>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleChange}
          style={{ display: "none" }}
        />
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Button onClick={handleChooseClick} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Choose CSV"}
          </Button>
          <Button variant="secondary">View sample format</Button>
        </div>
      </div>
    </div>
  );
}
