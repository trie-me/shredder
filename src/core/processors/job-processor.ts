import {Job} from "../configuration/abstractions/job";
import {Page} from "puppeteer";
import {from, map, mergeMap, share, shareReplay} from "rxjs";
import {executeTask} from "./task-processor";
import {RunnerContext} from "../../runners/abstractions/runner-context";

function adaptAsyncPromiseClose(page: Page) {
  return () => {
    (async () => await page.close())()
  };
}

export function executeJob(job: Job, page: Page, context: RunnerContext) {
  const result = from(job.tasks).pipe(
    mergeMap(task => executeTask(page, task, context).pipe(
      map(result => {
        result.jobResource = job.uri;
        return {...job.data, ...result};
      })
    ))
  );

  return result;
}
