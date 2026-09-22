import { Users, Bot } from 'lucide-react'
import type { GameMode } from '../game/types'
import styles from './ModeSelector.module.css'

interface ModeSelectorProps {
  mode: GameMode
  onChange: (mode: GameMode) => void
}

export default function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className={styles.wrapper} role="group" aria-label="Game mode">
      <button
        className={[styles.btn, mode === 'pvp' ? styles.active : ''].join(' ')}
        onClick={() => onChange('pvp')}
        aria-pressed={mode === 'pvp'}
      >
        <Users size={15} strokeWidth={2.5} />
        2 Players
      </button>
      <button
        className={[styles.btn, mode === 'cpu' ? styles.active : ''].join(' ')}
        onClick={() => onChange('cpu')}
        aria-pressed={mode === 'cpu'}
      >
        <Bot size={15} strokeWidth={2.5} />
        vs CPU
      </button>
    </div>
  )
}
