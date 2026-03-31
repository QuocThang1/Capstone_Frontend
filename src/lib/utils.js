/**
 * Utility function to conditionally join classNames together
 * @param {...any} classes - Classes to merge
 * @returns {string} - Merged class string
 */
export function cn(...classes) {
  return classes
    .flat()
    .filter((c) => typeof c === "string" && c.trim())
    .join(" ");
}
