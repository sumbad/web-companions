/**
 * Check a condition and return value or undefined
 *
 * @param condition - boolean parameter to check
 * @param value - this parameter will be returned if the condition is true
 * @returns the value if the condition returns true
 */
export function is<T>(condition: boolean, value: T) {
  return condition ? value : undefined;
}
