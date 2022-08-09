import {FieldValueTransform} from "../core/transforms/abstractions/field-value-transform";
import {ShredderConfig} from "../core/configuration/abstractions/shredder-config";
import {JobScheduler} from "../core/schedulers/abstractions/job-scheduler";
import {OutputSink} from "../core/sinks/abstractions/output-sink";
import {defaultScheduler} from "../core/schedulers/default-scheduler";
import {TransformDeclaration} from "./abstractions/transform-declaration";
import {JobRunner, JobRunnerConstructor} from "../runners/abstractions/job-runner";
import {DefaultRunner} from "../runners/default-runner";
import {RunnerContext} from "../runners/abstractions/runner-context";
import {getBrowserInstanceFromConfiguration} from "../core/browser/utilities";
import {validateConfiguration} from "../core/validation/scraper-input-validator";
import {shareReplay} from "rxjs";
import {stripNonIntegerCurrencyValues} from "../core/transforms/currency-value-transform";
import {ConsoleSink} from "../core/sinks/console-sink";

const DEFAULT_TRANSFORM_INDEX = new Map<string, FieldValueTransform>([
  ["currency", stripNonIntegerCurrencyValues]
]);

export class ShredderBuilder {
  private constructor(
    private readonly config: ShredderConfig,
    private readonly transforms: Map<string, FieldValueTransform> = new Map<string, FieldValueTransform>(),
    private scheduler: JobScheduler = defaultScheduler,
    private readonly sinks: OutputSink[] = [],
    private runner: JobRunnerConstructor = DefaultRunner
  ) {
  }

  static create(config: ShredderConfig): ShredderBuilder {
    return new ShredderBuilder(config);
  }

  /***
   * Set the runner to use for the job execution
   * @param runner - a function which constructs a runner
   */
  useRunner(runner: JobRunnerConstructor) {
    this.runner = runner;
    return this;
  }

  /**
   * Configures a set of transform declarations by the key
   * @param transforms
   */
  withTransforms(...transforms: TransformDeclaration[]): ShredderBuilder {
    for (const t of transforms)
      this.transforms.set(t.key, t.transform)
    return this;
  }

  withTransform(key: string, transform: FieldValueTransform): ShredderBuilder {
    this.transforms.set(key, transform);
    return this;
  }

  useScheduler(scheduler: JobScheduler) {
    this.scheduler = scheduler;
  }

  /**
   * Sets one or more sinks that will be used for output
   * @param sinks
   */
  withSinks(...sinks: OutputSink[]) {
    this.sinks.push(...sinks);
    return this;
  }

  build(): JobRunner {
    const context: RunnerContext = this.getRunnerContext();
    validateConfiguration(this.config);
    return new this.runner(context);
  }

  private getRunnerContext(): RunnerContext {
    return {
      config: this.config,
      transforms: this.transforms.size === 0 ? DEFAULT_TRANSFORM_INDEX : this.transforms,
      sinks: this.sinks.length === 0 ? [ConsoleSink] : this.sinks,
      scheduler: this.scheduler,
      browser: getBrowserInstanceFromConfiguration(this.config).pipe(shareReplay(1))
    };
  }
}
