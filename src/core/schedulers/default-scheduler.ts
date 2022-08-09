import {Job} from "../configuration/abstractions/job";
import {from, mergeMap, Observable, of} from "rxjs";

export function defaultScheduler(...jobs: Job[]): Observable<Job> {
  return from(jobs).pipe(
    mergeMap(job => of(job), 4)
  );
}
