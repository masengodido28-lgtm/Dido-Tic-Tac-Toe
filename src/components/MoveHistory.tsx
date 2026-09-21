import type { HistoryEntry } from '../game/types'
import styles from './MoveHistory.module.css'

interface MoveHistoryProps {
  history: HistoryEntry[]
  currentStep: number
  onJumpTo: (step: number) => void
}

const COLS = ['a', 'b', 'c']
const ROWS = ['1', '2', '3']

function formatCell(index: number): string {
  if (index === -1) return '—'
  const col = COLS[index % 3]
  const row = ROWS[Math.floor(index / 3)]
  return `${col}${row}`
}

export default function MoveHistory({ history, currentStep, onJumpTo }: MoveHistoryProps) {
  return (
    <div className={styles.panel} role="region" aria-label="Move history">
      <h2 className={styles.title}>Move History</h2>
      <p className={styles.hint}>Click any move to time-travel ⏪</p>
      <ol className={styles.list}>
        {history.map((entry, step) => {
          const isActive = step === currentStep
          const label =
            step === 0
              ? 'Game start'
              : `Move ${step}: ${entry.movePlayer} → ${formatCell(entry.moveIndex)}`

          return (
            <li key={step} className={styles.item}>
              <button
                className={[styles.btn, isActive ? styles.active : ''].join(' ')}
                onClick={() => onJumpTo(step)}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className={styles.stepNum}>{step}</span>
                <span className={styles.desc}>{label}</span>
                {isActive && <span className={styles.dot} aria-hidden="true" />}
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
