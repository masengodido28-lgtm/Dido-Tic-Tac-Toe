import type { Cell } from '../game/types'
import styles from './Square.module.css'

interface SquareProps {
  value: Cell
  onClick: () => void
  isWinning: boolean
  disabled: boolean
}

export default function Square({ value, onClick, isWinning, disabled }: SquareProps) {
  return (
    <button
      className={[
        styles.square,
        value === 'X' ? styles.x : value === 'O' ? styles.o : '',
        isWinning ? styles.winning : '',
        disabled ? styles.disabled : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ?? 'empty cell'}
    >
      {value && <span className={styles.mark}>{value}</span>}
    </button>
  )
}
