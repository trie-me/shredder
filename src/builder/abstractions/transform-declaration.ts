import {FieldValueTransform} from "../../core/transforms/abstractions/field-value-transform";

export interface TransformDeclaration {
  key: string,
  transform: FieldValueTransform
}
