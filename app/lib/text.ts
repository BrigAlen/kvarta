/** Есть ли в строке хотя бы одна буква (любого алфавита). Имя «111» не годится. */
export function hasLetter(value: string): boolean {
  for (const ch of value) {
    if (ch.toLowerCase() !== ch.toUpperCase()) return true;
  }
  return false;
}
