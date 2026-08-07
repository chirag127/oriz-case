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
  titleCase,
  sentenceCase,
  studlyCase,
  inverseCase,
  convertLines,
} from './cases'
import { slugify, handleify, reformatIdentifier } from './slug'

describe('words tokenizer', () => {
  it('splits camelCase', () => expect(words('fooBarBaz')).toEqual(['foo', 'bar', 'baz']))
  it('splits PascalCase', () => expect(words('FooBar')).toEqual(['foo', 'bar']))
  it('splits snake/kebab', () => expect(words('foo_bar-baz')).toEqual(['foo', 'bar', 'baz']))
  it('splits spaces + punctuation', () => expect(words('foo bar, baz!')).toEqual(['foo', 'bar', 'baz']))
  it('keeps acronym then word', () => expect(words('HTTPServer')).toEqual(['http', 'server']))
  it('splits digit boundaries', () => expect(words('v2Model')).toEqual(['v', '2', 'model']))
  it('empty -> []', () => expect(words('')).toEqual([]))
})

describe('case builders', () => {
  const src = 'hello world foo'
  it('camel', () => expect(camelCase(src)).toBe('helloWorldFoo'))
  it('pascal', () => expect(pascalCase(src)).toBe('HelloWorldFoo'))
  it('snake', () => expect(snakeCase(src)).toBe('hello_world_foo'))
  it('constant', () => expect(screamingSnakeCase(src)).toBe('HELLO_WORLD_FOO'))
  it('kebab', () => expect(kebabCase(src)).toBe('hello-world-foo'))
  it('cobol', () => expect(screamingKebabCase(src)).toBe('HELLO-WORLD-FOO'))
  it('dot', () => expect(dotCase(src)).toBe('hello.world.foo'))
  it('path', () => expect(pathCase(src)).toBe('hello/world/foo'))
  it('round-trips from any case', () => {
    expect(camelCase('HELLO_WORLD')).toBe('helloWorld')
    expect(snakeCase('helloWorld')).toBe('hello_world')
    expect(pascalCase('hello-world')).toBe('HelloWorld')
  })
})

describe('title + sentence', () => {
  it('title keeps small words lower mid-sentence', () =>
    expect(titleCase('the lord of the rings')).toBe('The Lord of the Rings'))
  it('title caps first + last', () =>
    expect(titleCase('a tale of two')).toBe('A Tale of Two'))
  it('sentence', () => expect(sentenceCase('HELLO WORLD foo')).toBe('Hello world foo'))
})

describe('meme cases', () => {
  it('studly alternates letters', () => expect(studlyCase('hello')).toBe('HeLlO'))
  it('inverse flips', () => expect(inverseCase('Hello')).toBe('hELLO'))
})

describe('multi-line', () => {
  it('converts each line independently', () =>
    expect(convertLines('foo bar\nbaz qux', kebabCase)).toBe('foo-bar\nbaz-qux'))
})

describe('slug + handle', () => {
  it('slugify basic', () => expect(slugify('Hello World! 2026')).toBe('hello-world-2026'))
  it('slugify strips diacritics', () => expect(slugify('Café Déjà Vu')).toBe('cafe-deja-vu'))
  it('slugify custom sep', () => expect(slugify('a b c', '_')).toBe('a_b_c'))
  it('handleify caps length + underscores', () =>
    expect(handleify('John Q. Public')).toBe('john_q_public'))
  it('handleify truncates', () =>
    expect(handleify('a b c d e f g h i j k l m', 7)).toBe('a_b_c_d'))
})

describe('reformatIdentifier', () => {
  it('camel', () => expect(reformatIdentifier('user_id', 'camel')).toBe('userId'))
  it('pascal', () => expect(reformatIdentifier('user_id', 'pascal')).toBe('UserId'))
  it('snake', () => expect(reformatIdentifier('userId', 'snake')).toBe('user_id'))
  it('kebab', () => expect(reformatIdentifier('userId', 'kebab')).toBe('user-id'))
})
