import type { Board, Player } from './types'

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const

/** Returns the winner if one exists, otherwise null. */
export function calculateWinner(board: Board): Player | null {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Player
    }
  }
  return null
}

/** Returns the winning line indices, or null. */
export function getWinningLine(board: Board): number[] | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [...line]
    }
  }
  return null
}

/** True when board is full and no winner. */
export function calculateDraw(board: Board): boolean {
  return board.every((cell) => cell !== null) && calculateWinner(board) === null
}
