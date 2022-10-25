import {ArgValidator} from "./abstractions/arg-validator";

function getDefaultRuleErrorMessage(rule: ArgValidator<any>, value?: any) {
  return `Rule definition for ${rule.name} is invalid. Value: ${JSON.stringify(value ?? "value not provided")}`;
}

function assertValidRule(rule: ArgValidator<any>) {
  if (!!rule.name && typeof (rule?.rule) === 'function')
    return;
  throw getDefaultRuleErrorMessage(rule, rule);
}

function executeRule<T>(value: any, validator: ArgValidator<T>) {
  assertValidRule(validator);
  if (validator.rule(value)) return;
  throw Error(validator.message
    ? validator.message
    : validator.messageFn
      ? validator.messageFn(validator, value)
      : getDefaultRuleErrorMessage(validator, value));
}

export function validate<T>(value: T, ...rules: ArgValidator<T>[]) {
  rules.forEach(rule => executeRule(value, rule));
}
