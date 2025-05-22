/**
 * @description Handle debounce function
 * @param func
 * @param delay
 * @returns {Function}
 * @example debounce(() => console.log("Hello"), 1000)()
 */

export function debounce<T extends (...args: string[]) => void>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
