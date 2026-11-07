/*
  The red Send button used by every live tool.
  Shows "Sending…" while waiting and "Wait 12s" during a rate-limit cooldown.
*/
import { useCooldown } from "../../ai/cooldown";

interface Props {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
  label?: string;
}

export function SendButton({ onClick, loading, disabled = false, label = "Send to Gemini" }: Props) {
  const cooldown = useCooldown();
  const text = loading ? "Sending…" : cooldown > 0 ? `Wait ${cooldown}s` : `${label} →`;

  return (
    <button
      type="button"
      className="btn btn--primary label"
      onClick={onClick}
      disabled={disabled || loading || cooldown > 0}
    >
      {text}
    </button>
  );
}
