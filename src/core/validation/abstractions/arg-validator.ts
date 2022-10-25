export interface ArgValidator<T> {
  name: string;
  rule: (arg: T) => boolean;
  message?: string;
  messageFn?: (v: ArgValidator<T>, value?: any) => string;
}
