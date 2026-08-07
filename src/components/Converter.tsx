import { useState, useCallback, useRef } from 'react'
import { CASES, convertLines, type CaseId } from '../lib/cases'
import { AiPanel } from './AiPanel'

const SAMPLE = 'getUserProfile\nHTTP_response_code\nmy-awesome-project\nParse XML File 2'

type Mode = 'block' | 'lines'

export default function Converter() {
  const [input, setInput] = useState(SAMPLE)
  const [mode, setMode] = useState<Mode>('lines')
  const [copied, setCopied] = useState<CaseId | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const transform = useCallback(
    (fn: (s: string) => string) =>
      mode === 'lines' ? convertLines(input, fn) : fn(input),
    [input, mode],
  )

  const copy = useCallback(async (id: CaseId, value: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(id)
    setTimeout(() => setCopied(null), 1200)
  }, [])

  const loadFile = useCallback(async (file: File) => {
    const { readAsText } = await import('@chirag127/oz-file')
    setInput(await readAsText(file))
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const f = e.dataTransfer.files?.[0]
      if (f) loadFile(f)
    },
    [loadFile],
  )

  return (
    <div className="cx">
      <section
        className={`cx-input${dragging ? ' is-drag' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <div className="cx-input__bar">
          <label className="cx-label" htmlFor="cx-src">
            Source text
          </label>
          <div className="cx-input__tools">
            <div className="cx-seg" role="group" aria-label="Conversion granularity">
              <button
                type="button"
                aria-pressed={mode === 'lines'}
                className={mode === 'lines' ? 'is-on' : ''}
                onClick={() => setMode('lines')}
              >
                per line
              </button>
              <button
                type="button"
                aria-pressed={mode === 'block'}
                className={mode === 'block' ? 'is-on' : ''}
                onClick={() => setMode('block')}
              >
                whole block
              </button>
            </div>
            <button type="button" className="cx-ghost" onClick={() => fileRef.current?.click()}>
              Load file
            </button>
            <button
              type="button"
              className="cx-ghost"
              onClick={() => setInput('')}
              disabled={!input}
            >
              Clear
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.md,.csv,.json,.js,.ts,.py,text/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) loadFile(f)
              }}
            />
          </div>
        </div>
        <textarea
          id="cx-src"
          className="cx-src"
          value={input}
          spellCheck={false}
          placeholder="Type, paste, or drop a text file…"
          onChange={(e) => setInput(e.target.value)}
          rows={5}
        />
        {dragging && <div className="cx-drop-hint">Drop to load</div>}
      </section>

      <section className="cx-grid" aria-label="Converted output">
        {CASES.map((c) => {
          const value = input ? transform(c.fn) : ''
          return (
            <article key={c.id} className="cx-card">
              <header className="cx-card__head">
                <span className="cx-card__glyph" aria-hidden="true">
                  {c.glyph}
                </span>
                <div className="cx-card__meta">
                  <h3 className="cx-card__title">{c.label}</h3>
                  <p className="cx-card__hint">{c.hint}</p>
                </div>
                <button
                  type="button"
                  className="cx-copy"
                  disabled={!value}
                  onClick={() => copy(c.id, value)}
                  aria-label={`Copy ${c.label}`}
                >
                  {copied === c.id ? 'copied' : 'copy'}
                </button>
              </header>
              <output className="cx-card__out">
                {value || <span className="cx-empty">—</span>}
              </output>
            </article>
          )
        })}
      </section>

      <AiPanel />
    </div>
  )
}
