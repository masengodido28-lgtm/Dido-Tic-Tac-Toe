import type { Board as BoardType } from '../game/types'
import Square from './Square'
import styles from './Board.module.css'

interface BoardProps {
  board: BoardType
  winningLine: number[] | null
  gameOver: boolean
  onSquareClick: (index: number) => void
}

export default function Board({ board, winningLine, gameOver, onSquareClick }: BoardProps) {
  return (
    <div className={styles.board} role="grid" aria-label="Tic Tac Toe board">
      {board.map((cell, i) => (
        <Square
          key={i}
          value={cell}
          onClick={() => onSquareClick(i)}
          isWinning={winningLine?.includes(i) ?? false}
          disabled={gameOver || cell !== null}
        />
      ))}
    </div>
  )
}
