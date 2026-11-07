/*
  A row of dots instead of a progress bar.
  Either:
    filled    = how many dots (from the left) are solid, or
    doneFlags = exactly which dots are solid (e.g. stages 1 and 3 done)
  current = (optional) index of a dot to show in red
*/
interface Props {
  total: number;
  filled?: number;
  doneFlags?: boolean[];
  current?: number;
  label?: string; // for screen readers
}

export function DotProgress({ total, filled = 0, doneFlags, current, label }: Props) {
  const isDone = (i: number) => (doneFlags ? Boolean(doneFlags[i]) : i < filled);
  const doneCount = Array.from({ length: total }, (_, i) => isDone(i)).filter(Boolean).length;

  return (
    <div className="dot-progress" role="img" aria-label={label ?? `${doneCount} of ${total} complete`}>
      {Array.from({ length: total }, (_, i) => {
        let cls = "dot-progress__dot";
        if (isDone(i)) cls += " dot-progress__dot--filled";
        if (i === current) cls += " dot-progress__dot--current";
        return <span key={i} className={cls} />;
      })}
    </div>
  );
}
