/*
  End-of-stage box: short wrap-up, "Mark stage complete", then the next-stage button.
  If `requires` is set, the stage can only be completed after that live task is done
  (e.g. Stage 2 needs the first prompt to have been sent).
*/
import { Link } from "react-router-dom";
import type { CheckpointBlock } from "../../content/types";
import { getStage, stageNum } from "../../content/stages";
import { markStageComplete, progress } from "../../storage/progress";
import { useSavedResult } from "../../storage/saved";
import { StatusDot } from "../ui/StatusDot";

export function CheckpointView({ block, stageId }: { block: CheckpointBlock; stageId: number }) {
  const next = getStage(stageId + 1);
  const { completedStages } = progress.use();
  const done = completedStages.includes(stageId);
  const required = useSavedResult(block.requires); // (hooks must always run, so read it first)
  const requirementMet = !block.requires || Boolean(required);

  return (
    <div className="lesson-block card checkpoint">
      <p className="label faint">End of stage {stageNum(stageId)}</p>
      <h3 className="checkpoint__title dot">{done ? block.title ?? "Stage complete" : "Ready to finish?"}</h3>
      {done && block.text && <p className="muted">{block.text}</p>}
      {!done && !requirementMet && (
        <p className="muted">{block.requiresText ?? "Finish the task above to complete this stage."}</p>
      )}

      <div className="button-row">
        {done ? (
          <>
            <span className="label checkpoint__done">
              <StatusDot tone="on" /> Completed
            </span>
            {next && (
              <Link to={`/stage/${next.id}`} className="btn btn--primary label">
                Next: {stageNum(next.id)} {next.short} →
              </Link>
            )}
          </>
        ) : (
          <button
            type="button"
            className="btn btn--primary label"
            onClick={() => markStageComplete(stageId)}
            disabled={!requirementMet}
          >
            Mark stage {stageNum(stageId)} complete
          </button>
        )}
      </div>
    </div>
  );
}
