import {Page} from "puppeteer";
import {Task} from "../configuration/abstractions/task";
import {PseudoDynamicArray, PseudoDynamicDictionary} from "./abstractions/pseudo-dynamic-dictionary";
import {from, map, mergeMap, Observable, reduce} from "rxjs";
import {executeAnalysis} from "./field-processor";
import {RunnerContext} from "../../runners/abstractions/runner-context";
import {FieldAnalysis} from "../configuration/abstractions/field-analysis";

function getArrayResult(task: Task, page: Page, context: RunnerContext) {
  return from(task.analyses)
    .pipe(
      mergeMap(
        a => executeAnalysis(a, page, context).pipe(
          map(v => [a, v] as [FieldAnalysis, [(string | undefined), FieldAnalysis]])
        )
      ), reduce((acc, [{data}, [value, op]]) => {
        const result = {...(data ?? {})} as PseudoDynamicDictionary;
        result[op.outputName || op.fieldName] = value;
        acc.result.push(result);
        return acc;
      }, <PseudoDynamicArray>{...task.data, taskName: task.name, result: []}));
}

function getDictionaryResult(task: Task, page: Page, context: RunnerContext) {
  return from(task.analyses)
    .pipe(mergeMap(
      a => executeAnalysis(a, page, context).pipe(
        map(v => [a, v] as [FieldAnalysis, [(string | undefined), FieldAnalysis]])
      )
    ), reduce((acc, [{data}, [value, op]]) => {
      acc = {...acc, ...(data ?? {})}
      acc[op.outputName || op.fieldName] = value;
      return acc;
    }, <PseudoDynamicDictionary>{...task.data, taskName: task.name}))
}

export function executeTask(page: Page, task: Task, context: RunnerContext): Observable<PseudoDynamicDictionary | PseudoDynamicArray> {
  if (task.listMode === true) {
    return getArrayResult(task, page, context);
  }
  return getDictionaryResult(task, page, context);
}
