import {OutputSink} from "./abstractions/output-sink";
import {PseudoDynamicDictionary} from "../processors/abstractions/pseudo-dynamic-dictionary";
import {EMPTY, Observable} from "rxjs";

export const JsonConsoleSink: OutputSink = {
  writeAsync(value: PseudoDynamicDictionary): Observable<void> {
    console.log(JSON.stringify(value));
    return EMPTY;
  }
};
