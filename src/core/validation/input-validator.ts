import {ArgValidator} from "./abstractions/arg-validator";

function getDefaultRuleErrorMessage(rule: ArgValidator<any>) {
  return `Rule definition for ${rule.name} is invalid`;
}

function assertValidRule(rule: ArgValidator<any>) {
  if (!!rule.name && typeof (rule?.rule) === 'function')
    return;
  throw getDefaultRuleErrorMessage(rule);
}

function executeRule<T>(value: any, validator: ArgValidator<T>) {
  assertValidRule(validator);
  if (validator.rule(value)) return;
  throw Error(validator.message
    ? validator.message
    : validator.messageFn
      ? validator.messageFn(validator)
      : getDefaultRuleErrorMessage(validator));
}

export function validate<T>(value: T, ...rules: ArgValidator<T>[]) {
  rules.forEach(rule => executeRule(value, rule));
}
