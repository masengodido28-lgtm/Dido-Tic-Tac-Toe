import { Trophy, Minus, History, Loader, Circle } from 'lucide-react'
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
    message =
      mode === 'cpu'
        ? winner === cpuPlayer
          ? 'CPU wins!'
          : 'You win!'
        : `Winner: ${winner}`
    variant = 'win'
  } else if (isDraw) {
    message = "It's a Draw!"
    variant = 'draw'
  } else if (isCpuThinking) {
    message = 'CPU is thinking…'
    variant = 'cpu'
  } else {
    const isCpuTurn = mode === 'cpu' && currentPlayer === cpuPlayer
    message = isCpuTurn ? `CPU's turn (${cpuPlayer})` : `Next: ${currentPlayer}`
  }

  function renderIcon() {
    if (winner) return <Trophy size={18} strokeWidth={2.5} />
    if (isDraw) return <Minus size={18} strokeWidth={2.5} />
    if (isViewingHistory) return <History size={18} strokeWidth={2} />
    if (isCpuThinking) return <Loader size={18} strokeWidth={2} className={styles.spin} />
    const color = currentPlayer === 'X' ? 'var(--x-color)' : 'var(--o-color)'
    return <Circle size={12} fill={color} stroke={color} />
  }

  return (
    <div
      className={[styles.status, styles[variant]].join(' ')}
      role="status"
      aria-live="polite"
    >
      <span className={styles.indicator} aria-hidden="true">
        {renderIcon()}
      </span>
      <span>{message}</span>
    </div>
  )
}
