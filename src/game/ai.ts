import type { Board, Player } from './types'
import { calculateWinner } from './logic'

/** Returns the best move index for the CPU (uses minimax). */
export function getBestMove(board: Board, cpuPlayer: Player): number {
  const humanPlayer: Player = cpuPlayer === 'O' ? 'X' : 'O'

  // Minimax with alpha-beta pruning
  function minimax(
    b: Board,
    depth: number,
    isMaximising: boolean,
    alpha: number,
    beta: number,
  ): number {
    const winner = calculateWinner(b)
    if (winner === cpuPlayer) return 10 - depth
    if (winner === humanPlayer) return depth - 10
    if (b.every((c) => c !== null)) return 0

    if (isMaximising) {
      let best = -Infinity
      for (let i = 0; i < 9; i++) {
        if (b[i] !== null) continue
        b[i] = cpuPlayer
        const score = minimax(b, depth + 1, false, alpha, beta)
        b[i] = null
        best = Math.max(best, score)
        alpha = Math.max(alpha, best)
        if (beta <= alpha) break
      }
      return best
    } else {
      let best = Infinity
      for (let i = 0; i < 9; i++) {
        if (b[i] !== null) continue
        b[i] = humanPlayer
        const score = minimax(b, depth + 1, true, alpha, beta)
        b[i] = null
        best = Math.min(best, score)
        beta = Math.min(beta, best)
        if (beta <= alpha) break
      }
      return best
    }
  }

  let bestScore = -Infinity
  let bestMove = -1

  // Collect all moves with the same best score so we can pick randomly among ties
  const candidates: number[] = []

  for (let i = 0; i < 9; i++) {
    if (board[i] !== null) continue
    board[i] = cpuPlayer
    const score = minimax(board, 0, false, -Infinity, Infinity)
    board[i] = null

    if (score > bestScore) {
      bestScore = score
      candidates.length = 0
      candidates.push(i)
    } else if (score === bestScore) {
      candidates.push(i)
    }
  }

  // Pick randomly among equal moves to add variety
  bestMove = candidates[Math.floor(Math.random() * candidates.length)]
  return bestMove
}
