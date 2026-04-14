import { Button } from "../../../components/ui/Button";

type SaveChartButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export function SaveChartButton({ onClick, disabled }: SaveChartButtonProps) {
  return (
    <Button variant="secondary" onClick={onClick} disabled={disabled}>
      Save to dashboard
    </Button>
  );
}
