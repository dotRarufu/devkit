/**
 * Returns the value of the first matching condition.
 *
 * Iterates through the provided cases in order and returns the value
 * associated with the first condition that evaluates to `true`.
 * If no conditions match, the `defaultValue` is returned.
 *
 * Useful as a lightweight alternative to chained `if/else` statements
 * or `switch` expressions when selecting values declaratively.
 *
 * @template T The return value type.
 *
 * @param cases - An array of tuples containing:
 * - a boolean condition
 * - the value to return if the condition is true
 *
 * @param defaultValue - The fallback value returned when no conditions match.
 *
 * @returns The value of the first matching case, or the default value.
 *
 * @example
 * ```ts
 * const status = match(
 *   [
 *     [age < 13, "child"],
 *     [age < 18, "teen"],
 *     [age >= 18, "adult"],
 *   ],
 *   "unknown"
 * );
 * ```
 *
 * @example
 * ```ts
 * const color = match(
 *   [
 *     [isError, "red"],
 *     [isWarning, "yellow"],
 *     [isSuccess, "green"],
 *   ],
 *   "gray"
 * );
 * ```
 */
export function match<T>(cases: Array<[boolean, T]>, defaultValue: T): T {
  for (const [condition, value] of cases) {
    if (condition) return value;
  }
  return defaultValue;
}
