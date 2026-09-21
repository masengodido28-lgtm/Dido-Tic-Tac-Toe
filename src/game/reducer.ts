import { calculateDraw, calculateWinner } from './logic'
import type { GameAction, GameState, HistoryEntry } from './types'

const EMPTY_BOARD = Array(9).fill(null)

const INITIAL_HISTORY: HistoryEntry[] = [
  { board: EMPTY_BOARD, currentPlayer: 'X', moveIndex: -1, movePlayer: null },
]

export const initialState: GameState = {
  board: EMPTY_BOARD,
  currentPlayer: 'X',
  winner: null,
  isDraw: false,
  history: INITIAL_HISTORY,
  stepIndex: 0,
  score: { X: 0, O: 0, draws: 0 },
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MAKE_MOVE': {
      const { index } = action

      // If we're viewing a past step, trim history to that point first
      const activeHistory = state.history.slice(0, state.stepIndex + 1)
      const currentEntry = activeHistory[activeHistory.length - 1]
      const { board, currentPlayer } = currentEntry

      // Ignore if game over or cell already filled
      if (state.winner || state.isDraw || board[index] !== null) {
        return state
      }

      const nextBoard = board.slice()
      nextBoard[index] = currentPlayer

      const winner = calculateWinner(nextBoard)
      const isDraw = !winner && calculateDraw(nextBoard)
      const nextPlayer = currentPlayer === 'X' ? 'O' : 'X'

      const newEntry: HistoryEntry = {
        board: nextBoard,
        currentPlayer: nextPlayer,
        moveIndex: index,
        movePlayer: currentPlayer,
      }

      const nextHistory = [...activeHistory, newEntry]
      const nextStep = nextHistory.length - 1

      const nextScore = { ...state.score }
      if (winner) nextScore[winner] += 1
      else if (isDraw) nextScore.draws += 1

      return {
        ...state,
        board: nextBoard,
        currentPlayer: nextPlayer,
        winner: winner ?? null,
        isDraw,
        history: nextHistory,
        stepIndex: nextStep,
        score: nextScore,
      }
    }

    case 'JUMP_TO': {
      const { step } = action
      if (step < 0 || step >= state.history.length) return state

      const entry = state.history[step]
      return {
        ...state,
        board: entry.board,
        currentPlayer: entry.currentPlayer,
        winner: calculateWinner(entry.board) ?? null,
        isDraw: calculateDraw(entry.board),
        stepIndex: step,
      }
    }

    case 'RESET': {
      return {
        ...initialState,
        // preserve the score across resets
        score: state.score,
      }
    }

    default:
      return state
  }
}
