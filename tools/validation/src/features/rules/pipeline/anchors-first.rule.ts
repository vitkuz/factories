import type { PipelineContext, PipelineRule } from '../rules.types.js';
import { defineRule } from '../rules.utils.js';
import { ANCHORS } from '../../pipeline/pipeline.utils.js';

/** Key order as written: Zod rebuilds `constants` with the known keys first, so read the document. */
const writtenConstantKeys = (document: unknown): string[] =>
  Object.keys((document as { constants: Record<string, unknown> }).constants);

export const anchorsFirst: PipelineRule = defineRule<PipelineContext>({
  id: 'anchors-first',
  description: `"constants" opens with ${ANCHORS.join(', ')}, in that order.`,
})(({ document }, report) => {
  const keys: string[] = writtenConstantKeys(document);
  return ANCHORS.every((anchor: string, index: number): boolean => keys[index] === anchor)
    ? []
    : [report.warning(`constants should open with ${ANCHORS.join(', ')} in that order`)];
});
