/*
  Dot-matrix loading animation: a 3×3 grid of dots that light up one by one
  in a stepped (mechanical) sequence while Gemini is thinking.
  With "reduce motion" on, the dots simply stay still.
*/

// The order the dots light up: around the edge clockwise, then the centre.
const ORDER = [0, 1, 2, 5, 8, 7, 6, 3, 4];

export function DotLoader({ label = "Thinking" }: { label?: string }) {
  return (
    <div className="dot-loader" role="status" aria-live="polite">
      <div className="dot-loader__grid" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <span
            key={i}
            className="dot-loader__dot"
            // Each dot starts its blink a little later than the one before it.
            style={{ animationDelay: `${ORDER.indexOf(i) * 90}ms` }}
          />
        ))}
      </div>
      <span className="label muted">{label}</span>
    </div>
  );
}
