import {getValidatedJobsFromConfig} from "../validation/scraper-input-validator";
import {ShredderConfig} from "./abstractions/shredder-config";

export function getConfigurationFromEnv(arg: string) {
  try {
    const v = JSON.parse(arg) as ShredderConfig;
    return v;
  } catch (ex) {
    throw ex;
  }
}

export function getValidatedJobs(arg: string) {
  const data = getConfigurationFromEnv(arg);
  return getValidatedJobsFromConfig(data.jobs);
}
