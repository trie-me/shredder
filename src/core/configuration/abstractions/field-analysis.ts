export interface FieldAnalysis {
  fieldName: string;
  selector: string;
  valueAtIndex?: number;
  isNumeric?: boolean;
  outputName?: string;
  transforms?: string[]
}
