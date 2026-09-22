import type { GameMode, Player } from '../game/types'
import styles from './StatusBar.module.css'

interface StatusBarProps {
  winner: Player | null
  isDraw: boolean
  currentPlayer: Player
  isViewingHistory: boolean
  viewingStep: number
  mode: GameMode
  cpuPlayer: Player
  isCpuThinking: boolean
}

export default function StatusBar({
  winner,
  isDraw,
  currentPlayer,
  isViewingHistory,
  viewingStep,
  mode,
  cpuPlayer,
  isCpuThinking,
}: StatusBarProps) {
  let message: string
  let variant: 'neutral' | 'win' | 'draw' | 'history' | 'cpu' = 'neutral'

  if (isViewingHistory) {
    message = viewingStep === 0 ? 'Game start' : `Viewing move #${viewingStep}`
    variant = 'history'
  } else if (winner) {
    const label =
      mode === 'cpu'
        ? winner === cpuPlayer
          ? 'CPU wins! 🤖'
          : 'You win! 🎉'
        : `Winner: ${winner}`
    message = label
    variant = 'win'
  } else if (isDraw) {
    message = "It's a Draw! 🤝"
    variant = 'draw'
  } else if (isCpuThinking) {
    message = 'CPU is thinking…'
    variant = 'cpu'
  } else {
    const isCpuTurn = mode === 'cpu' && currentPlayer === cpuPlayer
    message = isCpuTurn ? `CPU's turn (${cpuPlayer})` : `Next: ${currentPlayer}`
  }

  const icon = winner
    ? winner === 'X' ? '🟢' : '🩷'
    : isDraw
    ? '🤝'
    : isViewingHistory
    ? '⏪'
    : isCpuThinking
    ? '⌛'
    : currentPlayer === 'X'
    ? '🟢'
    : '🩷'

  return (
    <div
      className={[styles.status, styles[variant]].join(' ')}
      role="status"
      aria-live="polite"
    >
      <span className={styles.indicator} aria-hidden="true">{icon}</span>
      <span>{message}</span>
    </div>
  )
}
