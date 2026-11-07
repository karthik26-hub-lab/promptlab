/*
  Draws a small dot-matrix icon from rows of "1" and "0".
  Example: ["010", "111", "010"] is a tiny plus sign.
*/
interface Props {
  rows: string[];
  lit?: boolean;   // false = all dots dim (e.g. a locked badge)
  accent?: boolean; // true = lit dots are red
}

export function DotIcon({ rows, lit = true, accent = false }: Props) {
  return (
    <div className="dot-icon" style={{ gridTemplateColumns: `repeat(${rows[0]?.length ?? 0}, 1fr)` }} aria-hidden="true">
      {rows.flatMap((row, r) =>
        row.split("").map((cell, c) => {
          let cls = "dot-icon__dot";
          if (cell === "1") cls += lit ? (accent ? " is-accent" : " is-on") : " is-dim";
          return <span key={`${r}-${c}`} className={cls} />;
        }),
      )}
    </div>
  );
}
