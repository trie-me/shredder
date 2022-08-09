/**
 * Imperial currency to float converter. Will strip any non-flat characters. Decimal preferencing
 * @param value
 */
export function stripNonIntegerCurrencyValues(value?: string) {
  const result = value?.replace(/[^\d.]/ig, '');
  return Number.parseFloat(result || '-1').toString();
}
