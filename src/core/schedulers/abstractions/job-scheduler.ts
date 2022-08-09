import {Job} from "../../configuration/abstractions/job";
import {Observable} from "rxjs";

export interface JobScheduler {
  (...jobs: Job[]): Observable<Job>;
}
