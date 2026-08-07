/**
 * ai.ts — optional AI polish. Lazy-imports @chirag127/oz-ai only when called,
 * so g4f never enters the initial bundle. Falls back cleanly if all providers die.
 */
import { camelCase, snakeCase } from './cases'
import { slugify } from './slug'

/** Suggest a good code identifier from a plain-English description. */
export async function suggestName(
  description: string,
  style: 'camel' | 'snake' = 'camel',
): Promise<string[]> {
  const { complete } = await import('@chirag127/oz-ai')
  const out = await complete(
    `Suggest 5 concise ${style === 'camel' ? 'camelCase' : 'snake_case'} identifier names for: "${description}". Reply ONLY a comma-separated list, no prose.`,
    { system: 'You are a terse senior engineer who names variables well.' },
  )
  const fn = style === 'camel' ? camelCase : snakeCase
  return out
    .split(/[,\n]/)
    .map((s) => fn(s.trim()))
    .filter(Boolean)
    .slice(0, 5)
}

/** Turn prose into a clean URL slug/handle via AI, with a local fallback. */
export async function suggestSlug(prose: string): Promise<string> {
  const { complete } = await import('@chirag127/oz-ai')
  const out = await complete(
    `Write ONE short, memorable, SEO-friendly URL slug for: "${prose}". Reply ONLY the slug, lowercase words, no quotes.`,
    { system: 'You write concise URL slugs. Output only the slug.' },
  )
  return slugify(out.trim())
}
