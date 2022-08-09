import {JobRunner} from "./job-runner";
import {RunnerContext} from "./runner-context";
import {Observable} from "rxjs";

export abstract class RunnerBase implements JobRunner {
  constructor(protected readonly context: RunnerContext) {
  }

  abstract run(): Observable<void>;
}
