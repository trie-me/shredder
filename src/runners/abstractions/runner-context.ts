import {ShredderConfig} from "../../core/configuration/abstractions/shredder-config";
import {FieldValueTransform} from "../../core/transforms/abstractions/field-value-transform";
import {JobScheduler} from "../../core/schedulers/abstractions/job-scheduler";
import {OutputSink} from "../../core/sinks/abstractions/output-sink";
import {Browser} from "puppeteer";
import {Observable} from "rxjs";

export interface RunnerContext {
  readonly config: ShredderConfig;
  readonly transforms: Map<string, FieldValueTransform>;
  readonly scheduler: JobScheduler;
  readonly sinks: OutputSink[];
  readonly browser: Observable<Browser>;
}
