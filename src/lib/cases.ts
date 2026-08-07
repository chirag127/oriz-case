/**
 * cases.ts — pure, zero-dep case & identifier transforms.
 * Tokenizer splits any input (camelCase, snake, kebab, spaces, acronyms,
 * digits) into words, then each case builds from those words.
 */

/** Split arbitrary text/identifier into lowercase word tokens. */
export function words(input: string): string[] {
  if (!input) return []
  return (
    input
      // split camelCase / PascalCase boundaries: fooBar -> foo Bar
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      // split acronym followed by word: HTTPServer -> HTTP Server
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      // split letter/number boundaries: v2Model -> v2 Model, box3d -> box 3d
      .replace(/([a-zA-Z])(\d)/g, '$1 $2')
      .replace(/(\d)([a-zA-Z])/g, '$1 $2')
      // any non-alphanumeric = separator
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map((w) => w.toLowerCase())
  )
}

const cap = (w: string) => (w ? w[0].toUpperCase() + w.slice(1) : w)

export function camelCase(input: string): string {
  const w = words(input)
  if (!w.length) return ''
  return w[0] + w.slice(1).map(cap).join('')
}

export function pascalCase(input: string): string {
  return words(input).map(cap).join('')
}

export function snakeCase(input: string): string {
  return words(input).join('_')
}

export function screamingSnakeCase(input: string): string {
  return words(input).join('_').toUpperCase()
}

export function kebabCase(input: string): string {
  return words(input).join('-')
}

export function screamingKebabCase(input: string): string {
  return words(input).join('-').toUpperCase()
}

export function dotCase(input: string): string {
  return words(input).join('.')
}

export function pathCase(input: string): string {
  return words(input).join('/')
}

export function spaceCase(input: string): string {
  return words(input).join(' ')
}

/** Title Case — capitalise every word (short words kept lower unless first/last). */
const SMALL = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'nor',
  'of', 'on', 'or', 'per', 'the', 'to', 'via', 'vs',
])
export function titleCase(input: string): string {
  const w = words(input)
  return w
    .map((word, i) =>
      i !== 0 && i !== w.length - 1 && SMALL.has(word) ? word : cap(word),
    )
    .join(' ')
}

/** Sentence case — first word capitalised, rest lower. */
export function sentenceCase(input: string): string {
  const w = words(input)
  if (!w.length) return ''
  return cap(w[0]) + (w.length > 1 ? ' ' + w.slice(1).join(' ') : '')
}

export function lowerCase(input: string): string {
  return input.toLowerCase()
}

export function upperCase(input: string): string {
  return input.toUpperCase()
}

/** Capitalise first letter of every word without normalising separators. */
export function capitalizeCase(input: string): string {
  return words(input).map(cap).join(' ')
}

/** Alternating/StUdLy caps for the meme. */
export function studlyCase(input: string): string {
  let up = false
  return input
    .split('')
    .map((ch) => {
      if (!/[a-zA-Z]/.test(ch)) return ch
      up = !up
      return up ? ch.toUpperCase() : ch.toLowerCase()
    })
    .join('')
}

/** Invert case of every letter. */
export function inverseCase(input: string): string {
  return input
    .split('')
    .map((ch) =>
      ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase(),
    )
    .join('')
}

export type CaseId =
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'constant'
  | 'kebab'
  | 'cobol'
  | 'dot'
  | 'path'
  | 'space'
  | 'title'
  | 'sentence'
  | 'lower'
  | 'upper'
  | 'capitalize'
  | 'studly'
  | 'inverse'

export interface CaseDef {
  id: CaseId
  label: string
  hint: string
  fn: (s: string) => string
  /** heading letter shown in the rotating hero specimen */
  glyph: string
}

export const CASES: CaseDef[] = [
  { id: 'camel', label: 'camelCase', hint: 'JS/TS variables, JSON keys', fn: camelCase, glyph: 'cC' },
  { id: 'pascal', label: 'PascalCase', hint: 'classes, types, components', fn: pascalCase, glyph: 'Pc' },
  { id: 'snake', label: 'snake_case', hint: 'Python, Ruby, SQL', fn: snakeCase, glyph: 's_' },
  { id: 'constant', label: 'CONSTANT_CASE', hint: 'env vars, constants', fn: screamingSnakeCase, glyph: 'C_' },
  { id: 'kebab', label: 'kebab-case', hint: 'URLs, CSS, filenames', fn: kebabCase, glyph: 'k-' },
  { id: 'cobol', label: 'COBOL-CASE', hint: 'HTTP headers, COBOL', fn: screamingKebabCase, glyph: 'K-' },
  { id: 'dot', label: 'dot.case', hint: 'namespaces, config keys', fn: dotCase, glyph: 'd.' },
  { id: 'path', label: 'path/case', hint: 'file paths, routes', fn: pathCase, glyph: 'p/' },
  { id: 'space', label: 'space case', hint: 'plain words', fn: spaceCase, glyph: 'sp' },
  { id: 'title', label: 'Title Case', hint: 'headings, titles', fn: titleCase, glyph: 'Tt' },
  { id: 'sentence', label: 'Sentence case', hint: 'prose, sentences', fn: sentenceCase, glyph: 'St' },
  { id: 'lower', label: 'lowercase', hint: 'all lower', fn: lowerCase, glyph: 'lo' },
  { id: 'upper', label: 'UPPERCASE', hint: 'all upper', fn: upperCase, glyph: 'UP' },
  { id: 'capitalize', label: 'Capitalize Words', hint: 'each word capped', fn: capitalizeCase, glyph: 'Cw' },
  { id: 'studly', label: 'StUdLyCaPs', hint: 'the meme', fn: studlyCase, glyph: 'Sc' },
  { id: 'inverse', label: 'iNVERSE cASE', hint: 'flip every letter', fn: inverseCase, glyph: 'iC' },
]

export const CASE_BY_ID: Record<CaseId, CaseDef> = Object.fromEntries(
  CASES.map((c) => [c.id, c]),
) as Record<CaseId, CaseDef>

/** Convert every line of a multi-line block independently. */
export function convertLines(input: string, fn: (s: string) => string): string {
  return input.split(/\r?\n/).map((line) => fn(line)).join('\n')
}
