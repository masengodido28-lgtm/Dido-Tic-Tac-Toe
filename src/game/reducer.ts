import { calculateDraw, calculateWinner } from './logic'
import type { GameAction, GameState, HistoryEntry, Player } from './types'

function makeInitialHistory(startingPlayer: Player): HistoryEntry[] {
  return [
    {
      board: Array(9).fill(null),
      currentPlayer: startingPlayer,
      moveIndex: -1,
      movePlayer: null,
    },
  ]
}

export const initialState: GameState = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  winner: null,
  isDraw: false,
  history: makeInitialHistory('X'),
  stepIndex: 0,
  score: { X: 0, O: 0, draws: 0 },
  mode: 'pvp',
  cpuPlayer: 'O',
  nextStartingPlayer: 'O', // after first game, O starts next
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MAKE_MOVE': {
      const { index } = action

      // Trim history to current view point
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
      const nextPlayer: Player = currentPlayer === 'X' ? 'O' : 'X'

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
      // Who starts this new game
      const startingPlayer = state.nextStartingPlayer
      // Next game the other player starts
      const nextStartingPlayer: Player = startingPlayer === 'X' ? 'O' : 'X'

      return {
        ...state,
        board: Array(9).fill(null),
        currentPlayer: startingPlayer,
        winner: null,
        isDraw: false,
        history: makeInitialHistory(startingPlayer),
        stepIndex: 0,
        // score persists
        nextStartingPlayer,
      }
    }

    case 'SET_MODE': {
      // Changing mode starts a fresh game, score resets
      return {
        ...initialState,
        mode: action.mode,
        score: { X: 0, O: 0, draws: 0 },
      }
    }

    default:
      return state
  }
}
