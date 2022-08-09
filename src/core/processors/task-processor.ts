import {Page} from "puppeteer";
import {Task} from "../configuration/abstractions/task";
import {PseudoDynamicDictionary} from "./abstractions/pseudo-dynamic-dictionary";
import {from, mergeMap, reduce} from "rxjs";
import {executeAnalysis} from "./field-processor";
import {RunnerContext} from "../../runners/abstractions/runner-context";

export function executeTask(page: Page, task: Task, context: RunnerContext) {
  return from(task.analyses)
    .pipe(mergeMap(
      a => executeAnalysis(a, page, context)
    ), reduce((acc, [value, op]) => {
      acc[op.outputName || op.fieldName] = value;
      return acc;
    }, <PseudoDynamicDictionary>{...task.data, taskName: task.name}));
}
