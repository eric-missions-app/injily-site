import 'server-only';

/** An `ILIKE` pattern matching values that contain `query`, with `%`, `_` and `\` matched literally. */
export function containsPattern(query: string): string {
  return `%${query.replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
}
