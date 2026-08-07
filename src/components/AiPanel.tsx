import { useState, useCallback } from 'react'

type Tab = 'name' | 'slug'

export function AiPanel() {
  const [tab, setTab] = useState<Tab>('name')
  const [desc, setDesc] = useState('')
  const [style, setStyle] = useState<'camel' | 'snake'>('camel')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [names, setNames] = useState<string[]>([])
  const [slug, setSlug] = useState('')
  const [copied, setCopied] = useState('')

  const copy = useCallback(async (v: string) => {
    await navigator.clipboard.writeText(v)
    setCopied(v)
    setTimeout(() => setCopied(''), 1200)
  }, [])

  const run = useCallback(async () => {
    if (!desc.trim()) return
    setBusy(true)
    setErr('')
    setNames([])
    setSlug('')
    try {
      if (tab === 'name') {
        const { suggestName } = await import('../lib/ai')
        setNames(await suggestName(desc, style))
      } else {
        const { suggestSlug } = await import('../lib/ai')
        setSlug(await suggestSlug(desc))
      }
    } catch {
      setErr('AI providers all unreachable. Core converter above still works offline.')
    } finally {
      setBusy(false)
    }
  }, [desc, style, tab])

  return (
    <section className="ai" aria-label="AI naming assistant">
      <div className="ai__head">
        <span className="ai__kicker">optional AI</span>
        <div className="cx-seg" role="tablist" aria-label="AI mode">
          <button
            role="tab"
            aria-selected={tab === 'name'}
            className={tab === 'name' ? 'is-on' : ''}
            onClick={() => setTab('name')}
          >
            name a variable
          </button>
          <button
            role="tab"
            aria-selected={tab === 'slug'}
            className={tab === 'slug' ? 'is-on' : ''}
            onClick={() => setTab('slug')}
          >
            prose → slug
          </button>
        </div>
      </div>

      <div className="ai__row">
        <input
          className="ai__in"
          value={desc}
          placeholder={
            tab === 'name'
              ? 'describe what it holds, e.g. "list of overdue invoices for a user"'
              : 'paste a title/sentence to slugify'
          }
          onChange={(e) => setDesc(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
        />
        {tab === 'name' && (
          <div className="cx-seg" role="group" aria-label="Identifier style">
            <button
              className={style === 'camel' ? 'is-on' : ''}
              aria-pressed={style === 'camel'}
              onClick={() => setStyle('camel')}
            >
              camel
            </button>
            <button
              className={style === 'snake' ? 'is-on' : ''}
              aria-pressed={style === 'snake'}
              onClick={() => setStyle('snake')}
            >
              snake
            </button>
          </div>
        )}
        <button className="ai__go" onClick={run} disabled={busy || !desc.trim()}>
          {busy ? 'thinking…' : 'suggest'}
        </button>
      </div>

      {err && <p className="ai__err" role="status">{err}</p>}

      {names.length > 0 && (
        <ul className="ai__chips">
          {names.map((n) => (
            <li key={n}>
              <button className="ai__chip" onClick={() => copy(n)}>
                <code>{n}</code>
                <span>{copied === n ? 'copied' : 'copy'}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {slug && (
        <button className="ai__slug" onClick={() => copy(slug)}>
          <code>{slug}</code>
          <span>{copied === slug ? 'copied' : 'copy'}</span>
        </button>
      )}
    </section>
  )
}
