import {
  capNotSpent,
  conditionIsValid,
  eventGiven,
  eventIsKnown,
  fallbackExists,
  reportsArePairs,
  runIsRunning,
  stepIsAgent,
  stepIsKnown,
  stepIsNamed,
  stepIsRunning,
  runDirGiven,
} from '../guards/index.js';
import type { RunCommand, StepEventOutput } from './commands.types.js';
import { recordStepEvent } from './step-event.utils.js';

export const stepDoneCommand: RunCommand<StepEventOutput> = {
  kind: 'run',
  name: 'step-done',
  arguments: ['runDir', 'step', 'event'],
  options: ['event', 'answer', 'output', 'report', 'note'],
  usage: '<runDir> <step> <EVENT> [--output <file> ...] [--report name=value ...] [--note <text>]',
  summary:
    'Records the event a subagent returned and prints where it goes (targets, ready, finished).',
  inputGuards: [runDirGiven, eventGiven],
  guards: [
    runIsRunning,
    stepIsNamed,
    stepIsKnown,
    stepIsRunning,
    stepIsAgent,
    reportsArePairs,
    eventIsKnown,
    conditionIsValid,
    fallbackExists,
    capNotSpent,
  ],
  apply: recordStepEvent(false),
};
