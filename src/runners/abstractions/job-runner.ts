import {Job} from "../../core/configuration/abstractions/job";
import {JobScheduler} from "../../core/schedulers/abstractions/job-scheduler";
import {RunnerContext} from "./runner-context";
import {Observable} from "rxjs";

export interface JobRunnerConstructor {
  new(context: RunnerContext): JobRunner;
}

export interface JobRunner {
  run(): Observable<void>;
}
