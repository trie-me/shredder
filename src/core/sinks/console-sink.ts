import {OutputSink} from "./abstractions/output-sink";
import {PseudoDynamicDictionary} from "../processors/abstractions/pseudo-dynamic-dictionary";
import {EMPTY, Observable} from "rxjs";

export const ConsoleSink: OutputSink = {
  writeAsync(value: PseudoDynamicDictionary): Observable<void> {
    console.log(value);
    return EMPTY;
  }
}
