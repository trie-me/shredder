import {stringTestData} from "./testdata";
import {getConfigurationFromEnv} from "./core/configuration/utilities";
import {ShredderBuilder} from "./builder/shredder-builder";
import {JsonConsoleSink} from "./core/sinks/json-console-sink";

const shredder$ = ShredderBuilder.create(getConfigurationFromEnv(stringTestData))
  .withSinks(JsonConsoleSink)
  .build()
  .run();


shredder$.subscribe({
  error: e => console.log(e),
  complete: () => console.log("completed run")
});
