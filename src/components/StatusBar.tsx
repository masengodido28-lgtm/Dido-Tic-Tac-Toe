import type { Player } from '../game/types'
import styles from './StatusBar.module.css'

interface StatusBarProps {
  winner: Player | null
  isDraw: boolean
  currentPlayer: Player
  isViewingHistory: boolean
  viewingStep: number
}

export default function StatusBar({
  winner,
  isDraw,
  currentPlayer,
  isViewingHistory,
  viewingStep,
}: StatusBarProps) {
  let message: string
  let variant: 'neutral' | 'win' | 'draw' | 'history' = 'neutral'

  if (isViewingHistory) {
    message = viewingStep === 0 ? 'Game start' : `Viewing move #${viewingStep}`
    variant = 'history'
  } else if (winner) {
    message = `Winner: ${winner}`
    variant = 'win'
  } else if (isDraw) {
    message = "It's a Draw!"
    variant = 'draw'
  } else {
    message = `Next Player: ${currentPlayer}`
  }

  return (
    <div
      className={[styles.status, styles[variant]].join(' ')}
      role="status"
      aria-live="polite"
    >
      <span className={styles.indicator} aria-hidden="true">
        {winner ? (winner === 'X' ? '🔴' : '🔵') : isDraw ? '🤝' : isViewingHistory ? '⏪' : currentPlayer === 'X' ? '🔴' : '🔵'}
      </span>
      <span>{message}</span>
    </div>
  )
}
