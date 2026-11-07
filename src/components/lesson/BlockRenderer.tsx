/*
  Turns a stage's list of blocks into UI, in order.
  To support a new block type: add it to content/types.ts, then add a case here.
*/
import type { Block } from "../../content/types";
import { CompareRunner } from "../tools/CompareRunner";
import { PromptBuilder } from "../tools/PromptBuilder";
import { BeforeAfterView } from "./BeforeAfterView";
import { NextWordView, PointsView, SectionView, TextView } from "./BasicBlocks";
import { CheckpointView } from "./CheckpointView";
import { ReflectionView } from "./ReflectionView";
import { AnalogyView, AnatomyView } from "./StructureBlocks";
import { TourView } from "./TourView";
import { CompareBlockView, PracticeBlockView } from "./ToolBlocks";

export function BlockRenderer({ blocks, stageId }: { blocks: Block[]; stageId: number }) {
  // Sections, before/after pairs and building blocks are numbered automatically, in order.
  let sectionCount = 0;
  let pairCount = 0;
  let analogyCount = 0;

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "section":
            return <SectionView key={i} block={block} number={++sectionCount} />;
          case "text":
            return <TextView key={i} block={block} />;
          case "points":
            return <PointsView key={i} block={block} />;
          case "nextWord":
            return <NextWordView key={i} block={block} />;
          case "tour":
            return <TourView key={i} block={block} />;
          case "beforeAfter":
            return <BeforeAfterView key={i} block={block} number={++pairCount} />;
          case "analogy":
            return <AnalogyView key={i} block={block} number={++analogyCount} />;
          case "anatomy":
            return <AnatomyView key={i} block={block} />;
          case "practice":
            return <PracticeBlockView key={i} block={block} />;
          case "compare":
            return <CompareBlockView key={i} block={block} />;
          case "reflection":
            return <ReflectionView key={i} block={block} />;
          case "builder":
            return (
              <div key={i} className="lesson-block">
                {block.heading && <h3 className="lesson-h3">{block.heading}</h3>}
                {block.intro && <p className="muted lesson-intro">{block.intro}</p>}
                <PromptBuilder saveAs={block.saveAs} reference={block.reference} />
              </div>
            );
          case "experiment":
            return (
              <div key={i} className="lesson-block">
                <h3 className="lesson-h3">{block.heading}</h3>
                <p className="muted lesson-intro">{block.intro}</p>
                <CompareRunner labelA={block.a.label} labelB={block.b.label} initialA={block.a.prompt} initialB={block.b.prompt} />
              </div>
            );
          case "checkpoint":
            return <CheckpointView key={i} block={block} stageId={stageId} />;
        }
      })}
    </>
  );
}
