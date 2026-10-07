import {
  capNotSpent,
  conditionIsValid,
  eventGiven,
  eventIsKnown,
  fallbackExists,
  reportsArePairs,
  runIsRunning,
  stepIsHuman,
  stepIsKnown,
  stepIsNamed,
  stepIsRunning,
  runDirGiven,
} from '../guards/index.js';
import type { RunCommand, StepEventOutput } from './commands.types.js';
import { recordStepEvent } from './step-event.utils.js';

export const humanCommand: RunCommand<StepEventOutput> = {
  kind: 'run',
  name: 'human',
  arguments: ['runDir', 'step', 'event'],
  options: ['answer', 'event', 'note', 'output', 'report'],
  usage: '<runDir> <step> <EVENT> [--note <text>] [--output <file> ...]',
  summary:
    "Records a person's answer at a human step (outputs default to the step's declared output) and prints where it goes.",
  inputGuards: [runDirGiven, eventGiven],
  guards: [
    runIsRunning,
    stepIsNamed,
    stepIsKnown,
    stepIsRunning,
    stepIsHuman,
    reportsArePairs,
    eventIsKnown,
    conditionIsValid,
    fallbackExists,
    capNotSpent,
  ],
  apply: recordStepEvent(true),
};
