import {ElementHandle, Page} from "puppeteer";
import {FieldAnalysis} from "../configuration/abstractions/field-analysis";
import {DEFAULT_SELECTOR_TIMEOUT} from "../browser/browser-constants";
import {from, map, mergeMap} from "rxjs";
import {FieldValueTransform} from "../transforms/abstractions/field-value-transform";
import {RunnerContext} from "../../runners/abstractions/runner-context";

function getQueryValue(operation: FieldAnalysis) {
  return (queryResult: ElementHandle[]) => {
    if (!queryResult)
      throw Error(`Failed to retrieve element id ${operation.fieldName} with selector ${operation.selector}`);
    return queryResult[operation.valueAtIndex ?? 0];
  };
}

export function wrapOperationWithHandlerOnExecute(page: Page, operation: FieldAnalysis, timeout?: number) {
  return from(page.waitForSelector(
    operation.selector, {timeout: timeout ?? DEFAULT_SELECTOR_TIMEOUT}
  )).pipe(
    mergeMap(_ => page.$$(operation.selector)),
    map(getQueryValue(operation)),
    map(handle => [handle, operation] as [ElementHandle, FieldAnalysis])
  );
}

function foldTransformResults(opTransforms: string[], transformIndex: Map<string, FieldValueTransform>, correctedNullValue: string | undefined) {
  return opTransforms.reduce((iValue, transformKey) => {
    if (!transformIndex.has(transformKey))
      throw Error(`Configured transform ${transformKey} does not match any known transform operator.`);
    const transformer = transformIndex?.get(transformKey) as FieldValueTransform;
    return transformer(iValue);
  }, correctedNullValue);
}

function isNotNull<T>(arg?: T): arg is T {
  return !!arg;
}

function applyFieldTransforms(op: FieldAnalysis, transformIndex?: Map<string, FieldValueTransform>) {
  return (value: string | null) => {
    if (isNotNull(transformIndex) && isNotNull(op.transforms)) {
      return foldTransformResults(
        op.transforms,
        transformIndex,
        value ?? undefined);
    }
    return value;
  };
}

function applyFieldValue(elementHandle: ElementHandle, op: FieldAnalysis, transforms?: Map<string, FieldValueTransform>) {
  return from(elementHandle.evaluate(element => element.textContent)).pipe(
    map(applyFieldTransforms(op, transforms)),
    map(v => [v, op] as [string | undefined, FieldAnalysis])
  )
}

export function executeAnalysis(analysis: FieldAnalysis, page: Page, context: RunnerContext) {
  return wrapOperationWithHandlerOnExecute(page, analysis).pipe(
    mergeMap(([handle, op]) => applyFieldValue(handle, op, context.transforms))
  );
}
