import { Button } from "../../../components/ui/Button";

type GenerateInsightButtonProps = {
  isLoading: boolean;
  onClick: () => void;
};

export function GenerateInsightButton({ isLoading, onClick }: GenerateInsightButtonProps) {
  return (
    <Button onClick={onClick} disabled={isLoading}>
      {isLoading ? "Generating…" : "Generate Insights"}
    </Button>
  );
}
