// utils/object.ts
export function hasObjectChanged<T extends object>(
  current: T,
  original: T | null | undefined,
  keys: (keyof T)[],
): boolean {
  if (!original) return false
  return keys.some((key) => current[key] !== original[key])
}
