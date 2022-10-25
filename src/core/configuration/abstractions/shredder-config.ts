import {Job} from "./job";

export interface ShredderConfig {
  writeToConsole?: boolean;
  writeToFile?: boolean;
  outfile?: string;
  jobs: Job[]
  headless?: boolean;
}
