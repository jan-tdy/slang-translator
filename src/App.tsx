import { useMemo, useState } from 'react'
import './App.css'
import { translate, translatedWordCount, type Direction } from './data/translate'

const PLACEHOLDER: Record<Direction, string> = {
  toStandard: "Type some slang… e.g. \"ngl that movie was bussin, no cap\"",
  toSlang: 'Type plain English… e.g. "Honestly that movie was excellent"',
}

const LABEL: Record<Direction, { from: string; to: string }> = {
  toStandard: { from: 'Slang', to: 'Standard English' },
  toSlang: { from: 'Standard English', to: 'Slang' },
}

function App() {
  const [direction, setDirection] = useState<Direction>('toStandard')
  const [input, setInput] = useState('')

  const output = useMemo(() => translate(input, direction), [input, direction])
  const matchCount = useMemo(() => translatedWordCount(input, direction), [input, direction])

  function swap() {
    setDirection((d) => (d === 'toStandard' ? 'toSlang' : 'toStandard'))
    setInput(output)
  }

  const { from, to } = LABEL[direction]

  return (
    <div className="page">
      <header className="header">
        <h1>Slang Translator</h1>
        <p className="subtitle">Bidirectional English slang ⇄ standard English</p>
      </header>

      <main className="panel">
        <div className="lang-bar">
          <span className="lang-label active">{from}</span>
          <button className="swap-btn" onClick={swap} aria-label="Swap languages" title="Swap languages">
            ⇄
          </button>
          <span className="lang-label active">{to}</span>
        </div>

        <div className="boxes">
          <div className="box">
            <textarea
              className="textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={PLACEHOLDER[direction]}
              spellCheck={false}
              autoFocus
            />
            {input && (
              <button className="clear-btn" onClick={() => setInput('')} aria-label="Clear text">
                ✕
              </button>
            )}
          </div>

          <div className="divider" aria-hidden="true" />

          <div className="box output-box">
            <div className="output-text">
              {output || <span className="placeholder">Translation</span>}
            </div>
            {output && (
              <button
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText(output)}
                aria-label="Copy translation"
                title="Copy translation"
              >
                ⧉
              </button>
            )}
          </div>
        </div>

        {input.trim() && (
          <p className="match-info">
            {matchCount > 0
              ? `Translated ${matchCount} slang term${matchCount === 1 ? '' : 's'}.`
              : 'No slang terms recognized — showing text unchanged.'}
          </p>
        )}
      </main>

      <footer className="footer">
        <p>Dictionary-based, runs entirely in your browser — no data leaves this page.</p>
      </footer>
    </div>
  )
}

export default App
