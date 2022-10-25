import {getConfigurationFromEnv} from "./core/configuration/utilities";
import {ShredderBuilder} from "./builder/shredder-builder";
import {JsonConsoleSink} from "./core/sinks/json-console-sink";
import * as Path from "path";
import {promises as fs} from "fs";
import {ShredderConfig} from "./core/configuration/abstractions/shredder-config";
import {FileSink, JsonLFileSinkAppendTo} from "./core/sinks/file-sink";

async function getSinks(config: ShredderConfig) {
  const sinks = [];
  if (config.writeToFile === true && config.outfile) {
    sinks.push(await JsonLFileSinkAppendTo(config.outfile));
  }
  if(config.writeToConsole === true) sinks.push(JsonConsoleSink);
  return sinks;
}

async function exists(path: string) {
  try {
    let cleanedPath = path;
    if (Path.isAbsolute(path)) {
      cleanedPath = path;
    } else cleanedPath = Path.join(process.cwd(), path);
    await fs.stat(path);
    return true;
  } catch (ex) {
    return false;
  }
}

if (process.argv.length >= 3) {
  const fileLocation = process.argv[2];
  if (!(await exists(fileLocation))) {
    throw 'Job configuration file was not found or was inaccessible at ' + fileLocation;
  }
  const values = await fs.readFile(fileLocation, 'utf8');
  const shredder$ = ShredderBuilder.create(getConfigurationFromEnv(values))
    .withSinks(...(await getSinks((JSON.parse(values)))))
    .build()
    .run();


  shredder$.subscribe({
    error: e => console.log(e),
    complete: () => console.log("completed run")
  });

} else throw `Job definition is required. Please provide the path to a job configuration file as the first argument after the application invocation. ex:\n node --es-module-specifier-resolution=node ./dist/index /path/to/job/config/file.json`
