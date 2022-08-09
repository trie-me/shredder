import {Job} from "./job";

export interface ShredderConfig {
  jobs: Job[]
  headless?: boolean;
}
