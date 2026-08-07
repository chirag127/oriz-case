/** slug.ts — URL/handle slug + code-identifier reformatters. Zero-dep. */
import { words, camelCase, snakeCase, kebabCase, pascalCase } from './cases'

/** ASCII slug: lowercase, hyphen-joined, diacritics stripped. */
export function slugify(input: string, sep = '-'): string {
  const ascii = input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining marks
  return words(ascii).join(sep)
}

/** Social handle: lowercase alnum + underscores, max 30, no leading digit sep. */
export function handleify(input: string, max = 30): string {
  const h = words(
    input.normalize('NFKD').replace(/[̀-ͯ]/g, ''),
  ).join('_')
  return h.slice(0, max).replace(/_+$/, '')
}

export type IdentStyle = 'camel' | 'pascal' | 'snake' | 'kebab'

/** Reformat a code identifier from one style to another (batch-friendly). */
export function reformatIdentifier(id: string, style: IdentStyle): string {
  switch (style) {
    case 'camel':
      return camelCase(id)
    case 'pascal':
      return pascalCase(id)
    case 'snake':
      return snakeCase(id)
    case 'kebab':
      return kebabCase(id)
  }
}
