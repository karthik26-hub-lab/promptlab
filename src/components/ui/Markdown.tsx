/*
  A small, SAFE Markdown renderer for AI answers and lesson results.

  Gemini usually answers in Markdown (lists, **bold**, tables, code).
  We turn that into React elements ourselves. We never inject raw HTML
  (no dangerouslySetInnerHTML), so a weird answer can't break the page.

  Supported:
    # / ## / ### headings      - or * bullet lists      1. numbered lists
    | pipe | tables |          ``` code blocks          > quotes
    **bold**   `inline code`   blank line = new paragraph
*/
import type { ReactNode } from "react";

/* ---------- Inline: **bold** and `code` ---------- */

function renderInline(text: string): ReactNode[] {
  // Split into pieces, keeping the **bold** and `code` parts as their own pieces.
  const pieces = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return pieces.map((piece, i) => {
    if (piece.startsWith("**") && piece.endsWith("**") && piece.length > 4) {
      return <strong key={i}>{piece.slice(2, -2)}</strong>;
    }
    if (piece.startsWith("`") && piece.endsWith("`") && piece.length > 2) {
      return <code key={i}>{piece.slice(1, -1)}</code>;
    }
    return piece;
  });
}

/* ---------- Block level ---------- */

const isBullet = (l: string) => /^\s*[-*•]\s+/.test(l);
const isNumbered = (l: string) => /^\s*\d+[.)]\s+/.test(l);
const isTableRow = (l: string) => l.trim().startsWith("|");
const isTableDivider = (l: string) => /^\s*\|?[\s:|-]+\|?\s*$/.test(l) && l.includes("-");

function splitRow(line: string): string[] {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}

export function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const key = blocks.length;

    // Blank line: just move on.
    if (!line.trim()) {
      i++;
      continue;
    }

    // ``` code block ```
    if (line.trim().startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) code.push(lines[i++]);
      i++; // skip the closing ```
      blocks.push(
        <pre key={key} className="md-pre">
          <code>{code.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    // Headings
    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      blocks.push(
        <p key={key} className="md-heading">
          {renderInline(heading[2])}
        </p>,
      );
      i++;
      continue;
    }

    // Table: header row, divider row, then body rows
    if (isTableRow(line) && i + 1 < lines.length && isTableDivider(lines[i + 1])) {
      const header = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && isTableRow(lines[i])) rows.push(splitRow(lines[i++]));
      blocks.push(
        <div key={key} className="md-table-wrap">
          <table className="md-table">
            <thead>
              <tr>{header.map((h, c) => <th key={c}>{renderInline(h)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri}>{r.map((cell, c) => <td key={c}>{renderInline(cell)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // Bullet or numbered list
    if (isBullet(line) || isNumbered(line)) {
      const numbered = isNumbered(line);
      const isItem = numbered ? isNumbered : isBullet;
      const marker = numbered ? /^\s*\d+[.)]\s+/ : /^\s*[-*•]\s+/;

      // Each item is a list of lines: the item line + any indented lines under it.
      const items: string[][] = [];
      while (i < lines.length) {
        const l = lines[i];
        if (isItem(l)) {
          items.push([l.replace(marker, "")]);
        } else if (/^\s+\S/.test(l) && !isBullet(l) && !isNumbered(l)) {
          items[items.length - 1].push(l.trim()); // indented continuation line
        } else {
          break;
        }
        i++;
      }

      const listItems = items.map((itemLines, n) => (
        <li key={n}>
          {itemLines.map((t, j) => (
            <span key={j} className={j > 0 ? "md-li-more" : undefined}>
              {j > 0 && <br />}
              {renderInline(t)}
            </span>
          ))}
        </li>
      ));
      blocks.push(
        numbered ? (
          <ol key={key} className="md-list">{listItems}</ol>
        ) : (
          <ul key={key} className="md-list">{listItems}</ul>
        ),
      );
      continue;
    }

    // Quote
    if (line.trim().startsWith(">")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) quote.push(lines[i++].replace(/^\s*>\s?/, ""));
      blocks.push(
        <blockquote key={key} className="md-quote">
          {renderInline(quote.join(" "))}
        </blockquote>,
      );
      continue;
    }

    // Paragraph: take this line, then keep collecting lines until something else starts.
    // (Always taking the first line means a stray "|" line can't cause an endless loop.)
    const para: string[] = [lines[i++]];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !isBullet(lines[i]) &&
      !isNumbered(lines[i]) &&
      !isTableRow(lines[i]) &&
      !lines[i].trim().startsWith("```") &&
      !/^#{1,4}\s/.test(lines[i])
    ) {
      para.push(lines[i++]);
    }
    blocks.push(
      <p key={key} className="md-p">
        {para.map((p, n) => (
          <span key={n}>
            {n > 0 && <br />}
            {renderInline(p)}
          </span>
        ))}
      </p>,
    );
  }

  return <div className="md">{blocks}</div>;
}
