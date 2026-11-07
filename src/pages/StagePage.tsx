/*
  One stage. Reads the stage from content/ by the number in the URL,
  then the BlockRenderer draws its lesson blocks in order.
*/
import { Link, Navigate, useParams } from "react-router-dom";
import { PageHead } from "../components/layout/PageHead";
import { DotDivider } from "../components/ui/DotDivider";
import { BlockRenderer } from "../components/lesson/BlockRenderer";
import { STAGES, getStage, stageNum } from "../content/stages";

export function StagePage() {
  const { id } = useParams();
  const stage = getStage(Number(id));

  // Unknown stage number → go to stage 1.
  if (!stage) return <Navigate to="/stage/1" replace />;

  const prev = getStage(stage.id - 1);
  const next = getStage(stage.id + 1);
  const isSoon = stage.status === "soon";

  return (
    <article>
      <div className="stage-number dot" aria-hidden="true">
        {stageNum(stage.id)}
      </div>
      <PageHead
        kicker={`Stage ${stage.id} of ${STAGES.length}${isSoon ? " · Coming soon" : ""}`}
        title={stage.title}
        summary={stage.summary}
        live={!isSoon}
      />

      {stage.blocks.length > 0 ? (
        <BlockRenderer blocks={stage.blocks} stageId={stage.id} />
      ) : (
        // No lesson content yet: show what's coming
        <div className="card">
          <p className="label muted">{isSoon ? "Coming soon" : "Lesson in progress"}</p>
          <p style={{ marginTop: 8 }}>
            This stage is being written. Stages 1 to 3 are the foundation, so start there if you haven't.
          </p>
          {stage.preview && stage.preview.length > 0 && (
            <>
              <p className="label faint" style={{ marginTop: 24 }}>
                What you'll learn
              </p>
              <ul className="soon-list">
                {stage.preview.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <DotDivider />

      {/* Previous / next stage */}
      <nav className="stage-pager" aria-label="Stage navigation">
        {prev ? (
          <Link to={`/stage/${prev.id}`} className="btn label">
            ← {stageNum(prev.id)} {prev.short}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/stage/${next.id}`} className="btn label">
            {stageNum(next.id)} {next.short} →
          </Link>
        )}
      </nav>
    </article>
  );
}
