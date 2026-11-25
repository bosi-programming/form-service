const regexToRemove = /\W/g;
export function cleanInput<T>(input: T): T {
  if (typeof input === 'string') {
    return input.replaceAll(regexToRemove, '') as T;
  }
  if (Array.isArray(input)) {
    return input.map((el) => cleanInput(el) as unknown) as T;
  }
  if (typeof input === 'object' && input !== undefined && input !== null) {
    return Object.entries(input as Record<string, unknown>).reduce(
      (acc, [key, val]) => ({
        ...acc,
        [cleanInput(key)]: cleanInput(val),
      }),
      {} as Record<string, unknown>,
    ) as T;
  }
  return input;
}
