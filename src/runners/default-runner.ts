import {Job} from "../core/configuration/abstractions/job";
import {RunnerContext} from "./abstractions/runner-context";
import {from, mergeMap, Observable, share} from "rxjs";
import {Browser} from "puppeteer";
import {getJobContext} from "../core/browser/utilities";
import {executeJob} from "../core/processors/job-processor";
import {OutputSink} from "../core/sinks/abstractions/output-sink";
import {PseudoDynamicDictionary} from "../core/processors/abstractions/pseudo-dynamic-dictionary";
import {RunnerBase} from "./abstractions/runner-base";

function runScraperJob(job: Job, browser: Browser, context: RunnerContext) {
  return from(getJobContext(job, browser)).pipe(
    mergeMap(([page, _]) => executeJob(job, page, context))
  );
}

function onComplete(stream: Observable<any>, fn: () => void) {
  stream.subscribe({
    complete: fn
  })
}

function onCompleteAsync(stream: Observable<any>, fn: () => Promise<void>) {
  stream.subscribe({
    complete: fn
  })
}

export class DefaultRunner extends RunnerBase {
  constructor(context: RunnerContext) {
    super(context);
  }


  override run(): Observable<void> {
    return this.context.browser.pipe(
      mergeMap(browser => this.getExecutionStream(browser))
    );
  }

  private getExecutionStream(browser: Browser) {
    const executionStream = this.context.scheduler(...this.context.config.jobs).pipe(
      mergeMap((job) =>
        runScraperJob(job, browser, this.context).pipe(
          mergeMap(result => this.applySinks(result))
        )), share());
    onCompleteAsync(executionStream, async () => await browser.close());
    return executionStream;
  }

  private applySinks(result: PseudoDynamicDictionary) {
    return from(this.context.sinks).pipe(
      mergeMap((sink: OutputSink) => sink.writeAsync(result))
    );
  }
}
