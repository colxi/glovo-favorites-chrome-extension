export function querySelectorStrict<T = HTMLElement>(
  element: Document | HTMLElement,
  query: string
): T {
  const result = element.querySelector(query)
  if (result === null) throw new Error(`Query did not match any element: ${query}`)
  return result as T
}
export function querySelectorAllStrict<T = HTMLElement>(
  element: Document | HTMLElement,
  query: string
): T[] {
  const result = element.querySelectorAll(query)
  return Array.from(result) as T[]
}
