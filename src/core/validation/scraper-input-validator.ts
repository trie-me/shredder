import {validate} from "./input-validator";
import {Task} from "../configuration/abstractions/task";
import {FieldAnalysis} from "../configuration/abstractions/field-analysis";
import {Job} from "../configuration/abstractions/job";
import {ArgValidator} from "./abstractions/arg-validator";
import {ShredderConfig} from "../configuration/abstractions/shredder-config";

function requiredJobFieldDescriptionArgumentMessageFn(rule: ArgValidator<FieldAnalysis>, value?: any) {
  return `Validation check failed for ${rule.name} with context ${value || "[NO CONTEXT]"}. Required`;
}

const defaultJobFieldRule = {
  messageFn: requiredJobFieldDescriptionArgumentMessageFn
};

const defaultAnalysisTaskValidators: ArgValidator<FieldAnalysis>[] = [
  {...defaultJobFieldRule, name: 'Name', rule: v => !!v.fieldName},
  {...defaultJobFieldRule, name: 'Selector', rule: v => !!v.selector}
];

const defaultTaskConfigValidators: ArgValidator<Task>[] = [
  {message: "Validation of name field failed for processors task. Required", name: 'Name', rule: v => !!v.name}
];

function validateJobOptions(options: Job) {
  validate(options, {message: 'Validation check failed for uri parameter. Required', name: 'uri', rule: v => !!v.uri})
}

function validateJobTasks(options: Job) {
  for (const task of options.tasks) {
    validate(task, ...defaultTaskConfigValidators);
    for (const analysis of task.analyses)
      validate(analysis, ...defaultAnalysisTaskValidators)

  }
}

export function validateConfiguration(config: ShredderConfig){
  for (const job of config.jobs) {
    validateJobOptions(job);
    validateJobTasks(job);
  }
  return config;
}

export function getValidatedJobsFromConfig(jobs: Job[]): Job[] {
  for (const job of jobs) {
    validateJobOptions(job);
    validateJobTasks(job);
  }
  return jobs;
}
