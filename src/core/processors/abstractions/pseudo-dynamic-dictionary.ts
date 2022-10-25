export type PseudoDynamicDictionary = { [p: string]: string | null | undefined };
export type PseudoDynamicArray = {[p: string]: any, result: PseudoDynamicDictionary[] };
