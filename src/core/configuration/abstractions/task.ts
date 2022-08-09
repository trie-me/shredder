import {FieldAnalysis} from "./field-analysis";

export interface Task {
  name: string;
  analyses: FieldAnalysis[];
  data?: { [key: string]: any }
}
