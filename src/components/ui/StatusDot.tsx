/*
  Small status dot.
  red  = active / needs attention (default)
  on   = fine / ready (solid, text colour)
  off  = inactive (dim grey)
*/
type Tone = "red" | "on" | "off";

export function StatusDot({ tone = "red", off = false }: { tone?: Tone; off?: boolean }) {
  const t = off ? "off" : tone;
  const cls = t === "red" ? "status-dot" : `status-dot status-dot--${t}`;
  return <span className={cls} aria-hidden="true" />;
}
