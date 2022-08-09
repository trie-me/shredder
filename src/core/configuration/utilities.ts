import {getValidatedJobsFromConfig} from "../validation/scraper-input-validator";
import {ShredderConfig} from "./abstractions/shredder-config";

export function getConfigurationFromEnv(arg: string) {
  return JSON.parse(arg) as ShredderConfig;
}

export function getValidatedJobs(arg: string) {
  const data = getConfigurationFromEnv(arg);
  return getValidatedJobsFromConfig(data.jobs);
}
