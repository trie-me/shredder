export interface FieldValueTransform {
  (value?: string): string | undefined;
}
