import type { Method } from '@packages/types'

export function validateRequestObject(
  requestData: unknown,
  controllersMap: Record<string, Method>
): true | string {
  // request object
  if (typeof requestData !== 'object' || !requestData) return 'Expecting an object in request'

  // Parameters
  if (!('parameters' in requestData)) return 'Parameters field not found'
  if (!Array.isArray(requestData.parameters)) return 'Expecting array in parameters'

  // Method
  if (!('method' in requestData)) return 'Method field not found'
  if (typeof requestData.method !== 'string') return 'Method must be a string'
  if (!(requestData.method in controllersMap)) return 'Unknown method requested'

  return true
}
