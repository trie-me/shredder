import {PseudoDynamicDictionary} from "../../processors/abstractions/pseudo-dynamic-dictionary";
import {Observable} from "rxjs";

export interface OutputSink {
  writeAsync(value: PseudoDynamicDictionary): Observable<void>;
}
