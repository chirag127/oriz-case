import { describe, it, expect } from 'vitest'
import {
  words,
  camelCase,
  pascalCase,
  snakeCase,
  screamingSnakeCase,
  kebabCase,
  screamingKebabCase,
  dotCase,
  pathCase,
  spaceCase,
  titleCase,
  sentenceCase,
  lowerCase,
  upperCase,
  capitalizeCase,
  studlyCase,
  inverseCase,
  convertLines,
  CASES,
  CASE_BY_ID,
} from './cases'
import { slugify, handleify, reformatIdentifier } from './slug'

describe('words tokenizer', () => {
  it('splits camelCase', () => expect(words('fooBarBaz')).toEqual(['foo', 'bar', 'baz']))
  it('splits PascalCase', () => expect(words('FooBar')).toEqual(['foo', 'bar']))
  it('splits snake/kebab', () => expect(words('foo_bar-baz')).toEqual(['foo', 'bar', 'baz']))
  it('splits spaces + punctuation', () => expect(words('foo bar, baz!')).toEqual(['foo', 'bar', 'baz']))
  it('keeps acronym then word', () => expect(words('HTTPServer')).toEqual(['http', 'server']))
  it('splits digit boundaries', () => expect(words('v2Model')).toEqual(['v', '2', 'model']))
  it('splits trailing digits', () => expect(words('box3d')).toEqual(['box', '3', 'd']))
  it('collapses repeated separators', () =>
    expect(words('foo___bar---baz')).toEqual(['foo', 'bar', 'baz']))
  it('trims leading/trailing separators', () =>
    expect(words('  _foo_  ')).toEqual(['foo']))
  it('lowercases every token', () => expect(words('FOO BAR')).toEqual(['foo', 'bar']))
  it('empty -> []', () => expect(words('')).toEqual([]))
  it('only separators -> []', () => expect(words('___ --- !!!')).toEqual([]))
})

describe('camelCase', () => {
  it('multi word', () => expect(camelCase('hello world foo')).toBe('helloWorldFoo'))
  it('single word', () => expect(camelCase('hello')).toBe('hello'))
  it('from CONSTANT', () => expect(camelCase('HELLO_WORLD')).toBe('helloWorld'))
  it('from kebab', () => expect(camelCase('hello-world')).toBe('helloWorld'))
  it('empty -> empty', () => expect(camelCase('')).toBe(''))
  it('separators only -> empty', () => expect(camelCase('---')).toBe(''))
})

describe('pascalCase', () => {
  it('multi word', () => expect(pascalCase('hello world foo')).toBe('HelloWorldFoo'))
  it('from kebab', () => expect(pascalCase('hello-world')).toBe('HelloWorld'))
  it('empty -> empty', () => expect(pascalCase('')).toBe(''))
})

describe('snakeCase', () => {
  it('multi word', () => expect(snakeCase('hello world foo')).toBe('hello_world_foo'))
  it('from camel', () => expect(snakeCase('helloWorld')).toBe('hello_world'))
  it('empty -> empty', () => expect(snakeCase('')).toBe(''))
})

describe('screamingSnakeCase (CONSTANT_CASE)', () => {
  it('multi word', () => expect(screamingSnakeCase('hello world foo')).toBe('HELLO_WORLD_FOO'))
  it('from camel', () => expect(screamingSnakeCase('helloWorld')).toBe('HELLO_WORLD'))
  it('empty -> empty', () => expect(screamingSnakeCase('')).toBe(''))
})

describe('kebabCase', () => {
  it('multi word', () => expect(kebabCase('hello world foo')).toBe('hello-world-foo'))
  it('from camel', () => expect(kebabCase('helloWorld')).toBe('hello-world'))
  it('empty -> empty', () => expect(kebabCase('')).toBe(''))
})

describe('screamingKebabCase (COBOL-CASE)', () => {
  it('multi word', () => expect(screamingKebabCase('hello world foo')).toBe('HELLO-WORLD-FOO'))
  it('empty -> empty', () => expect(screamingKebabCase('')).toBe(''))
})

describe('dotCase', () => {
  it('multi word', () => expect(dotCase('hello world foo')).toBe('hello.world.foo'))
  it('from camel', () => expect(dotCase('helloWorld')).toBe('hello.world'))
  it('empty -> empty', () => expect(dotCase('')).toBe(''))
})

describe('pathCase', () => {
  it('multi word', () => expect(pathCase('hello world foo')).toBe('hello/world/foo'))
  it('empty -> empty', () => expect(pathCase('')).toBe(''))
})

describe('spaceCase', () => {
  it('normalises any separators to single spaces', () =>
    expect(spaceCase('foo_bar-baz')).toBe('foo bar baz'))
  it('lowercases', () => expect(spaceCase('FooBar')).toBe('foo bar'))
  it('empty -> empty', () => expect(spaceCase('')).toBe(''))
})

describe('titleCase', () => {
  it('keeps small words lower mid-sentence', () =>
    expect(titleCase('the lord of the rings')).toBe('The Lord of the Rings'))
  it('caps first + last even if small', () =>
    expect(titleCase('a tale of two')).toBe('A Tale of Two'))
  it('caps a single small word (first === last)', () =>
    expect(titleCase('of')).toBe('Of'))
  it('empty -> empty', () => expect(titleCase('')).toBe(''))
})

describe('sentenceCase', () => {
  it('caps first, lowers rest', () =>
    expect(sentenceCase('HELLO WORLD foo')).toBe('Hello world foo'))
  it('single word', () => expect(sentenceCase('HELLO')).toBe('Hello'))
  it('empty -> empty', () => expect(sentenceCase('')).toBe(''))
})

describe('lowerCase / upperCase (raw, no tokenising)', () => {
  it('lower preserves separators', () => expect(lowerCase('Foo_Bar-BAZ')).toBe('foo_bar-baz'))
  it('upper preserves separators', () => expect(upperCase('foo_bar-baz')).toBe('FOO_BAR-BAZ'))
  it('lower empty', () => expect(lowerCase('')).toBe(''))
  it('upper empty', () => expect(upperCase('')).toBe(''))
})

describe('capitalizeCase', () => {
  it('caps each word, space-joined', () =>
    expect(capitalizeCase('hello world')).toBe('Hello World'))
  it('from mixed separators', () =>
    expect(capitalizeCase('foo_bar-baz')).toBe('Foo Bar Baz'))
  it('empty -> empty', () => expect(capitalizeCase('')).toBe(''))
})

describe('studlyCase (meme)', () => {
  it('alternates letters', () => expect(studlyCase('hello')).toBe('HeLlO'))
  it('skips non-letters when alternating', () => expect(studlyCase('a b c')).toBe('A b C'))
  it('empty -> empty', () => expect(studlyCase('')).toBe(''))
})

describe('inverseCase (meme)', () => {
  it('flips each letter', () => expect(inverseCase('Hello')).toBe('hELLO'))
  it('leaves non-letters, flips letters', () => expect(inverseCase('aB3d')).toBe('Ab3D'))
  it('empty -> empty', () => expect(inverseCase('')).toBe(''))
})

describe('convertLines', () => {
  it('converts each line independently', () =>
    expect(convertLines('foo bar\nbaz qux', kebabCase)).toBe('foo-bar\nbaz-qux'))
  it('handles CRLF newlines', () =>
    expect(convertLines('foo bar\r\nbaz qux', snakeCase)).toBe('foo_bar\nbaz_qux'))
  it('single line unchanged shape', () =>
    expect(convertLines('hello world', pascalCase)).toBe('HelloWorld'))
})

describe('CASES registry', () => {
  it('every CaseDef fn runs and every id maps back via CASE_BY_ID', () => {
    for (const def of CASES) {
      expect(typeof def.fn('hello world')).toBe('string')
      expect(CASE_BY_ID[def.id]).toBe(def)
    }
  })
  it('exposes the expected 16 cases', () => {
    expect(CASES).toHaveLength(16)
  })
})

describe('slugify', () => {
  it('basic', () => expect(slugify('Hello World! 2026')).toBe('hello-world-2026'))
  it('strips diacritics', () => expect(slugify('Café Déjà Vu')).toBe('cafe-deja-vu'))
  it('custom separator', () => expect(slugify('a b c', '_')).toBe('a_b_c'))
  it('empty -> empty', () => expect(slugify('')).toBe(''))
})

describe('handleify', () => {
  it('lowercase alnum + underscores', () =>
    expect(handleify('John Q. Public')).toBe('john_q_public'))
  it('truncates to max and trims trailing underscore', () =>
    expect(handleify('a b c d e f g h i j k l m', 7)).toBe('a_b_c_d'))
  it('strips diacritics', () => expect(handleify('Café')).toBe('cafe'))
  it('empty -> empty', () => expect(handleify('')).toBe(''))
})

describe('reformatIdentifier', () => {
  it('camel', () => expect(reformatIdentifier('user_id', 'camel')).toBe('userId'))
  it('pascal', () => expect(reformatIdentifier('user_id', 'pascal')).toBe('UserId'))
  it('snake', () => expect(reformatIdentifier('userId', 'snake')).toBe('user_id'))
  it('kebab', () => expect(reformatIdentifier('userId', 'kebab')).toBe('user-id'))
})
