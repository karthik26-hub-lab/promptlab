/*
  Header used at the top of every page:
  small uppercase kicker → big dot-font title → optional summary.
*/
import type { ReactNode } from "react";
import { StatusDot } from "../ui/StatusDot";

interface Props {
  kicker: string;
  title: string;
  summary?: ReactNode;
  live?: boolean; // show the red dot next to the kicker
}

export function PageHead({ kicker, title, summary, live = true }: Props) {
  return (
    <header className="page-head">
      <div className="page-head__kicker label muted">
        <StatusDot off={!live} />
        {kicker}
      </div>
      <h1 className="page-head__title dot">{title}</h1>
      {summary && <p className="page-head__summary muted">{summary}</p>}
    </header>
  );
}
