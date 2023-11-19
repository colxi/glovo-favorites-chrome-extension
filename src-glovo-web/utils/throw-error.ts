export function throwError(e: unknown): never {
  if (e instanceof Error) throw e
  else throw new Error(String(e))
}
