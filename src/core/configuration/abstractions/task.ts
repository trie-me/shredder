import {FieldAnalysis} from "./field-analysis";

export interface Task {
  name: string;
  listMode?: boolean;
  analyses: FieldAnalysis[];
  data?: { [key: string]: any }
}
