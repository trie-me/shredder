import {OutputSink} from "./abstractions/output-sink";
import {PseudoDynamicDictionary} from "../processors/abstractions/pseudo-dynamic-dictionary";
import {EMPTY, from, Observable} from "rxjs";
import {promises as fsAsync} from "fs";
import * as fs from "fs";

export async function JsonLFileSinkAppendTo(path: string) {
  if (!fs.existsSync(path)) {
    await fsAsync.writeFile(path, '', {encoding: 'utf8'});
  }
  return {
    writeAsync(value: PseudoDynamicDictionary): Observable<void> {
      return from(fsAsync.appendFile(path, JSON.stringify(value) + '\n', {encoding: 'utf8'}))
    }
  }
}

export const FileSink: OutputSink = {
  writeAsync(value: PseudoDynamicDictionary): Observable<void> {
    console.log(JSON.stringify(value));
    return EMPTY;
  }
};
