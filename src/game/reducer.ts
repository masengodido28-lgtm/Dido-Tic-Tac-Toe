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
  nextStartingPlayer: 'O',
  currentStartingPlayer: 'X',
  targetWins: 3,
  seriesWinner: null,
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MAKE_MOVE': {
      const { index } = action

      // Don't allow moves after the series is over
      if (state.seriesWinner) return state

      const activeHistory = state.history.slice(0, state.stepIndex + 1)
      const currentEntry = activeHistory[activeHistory.length - 1]
      const { board, currentPlayer } = currentEntry

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

      // Check if this win clinches the series
      const seriesWinner: Player | null =
        winner && nextScore[winner] >= state.targetWins ? winner : null

      return {
        ...state,
        board: nextBoard,
        currentPlayer: nextPlayer,
        winner: winner ?? null,
        isDraw,
        history: nextHistory,
        stepIndex: nextStep,
        score: nextScore,
        seriesWinner,
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

    // RESET: new game round — alternates starting player, keeps score + series state
    case 'RESET': {
      // Can't start a new round if series is over (must FULL_RESET)
      if (state.seriesWinner) return state

      const startingPlayer = state.nextStartingPlayer
      const nextStartingPlayer: Player = startingPlayer === 'X' ? 'O' : 'X'

      return {
        ...state,
        board: Array(9).fill(null),
        currentPlayer: startingPlayer,
        winner: null,
        isDraw: false,
        history: makeInitialHistory(startingPlayer),
        stepIndex: 0,
        nextStartingPlayer,
        currentStartingPlayer: startingPlayer,
      }
    }

    // RESTART: redo current round — same starting player, score untouched
    case 'RESTART': {
      if (state.seriesWinner) return state

      const startingPlayer = state.currentStartingPlayer
      return {
        ...state,
        board: Array(9).fill(null),
        currentPlayer: startingPlayer,
        winner: null,
        isDraw: false,
        history: makeInitialHistory(startingPlayer),
        stepIndex: 0,
      }
    }

    case 'SET_MODE': {
      return {
        ...initialState,
        mode: action.mode,
        targetWins: state.targetWins,
        score: { X: 0, O: 0, draws: 0 },
      }
    }

    // FULL_RESET: wipe everything — score, series, board — back to scratch
    case 'FULL_RESET': {
      return {
        ...initialState,
        mode: state.mode,
        targetWins: state.targetWins,
      }
    }

    // SET_TARGET: change race length — implicitly resets the series
    case 'SET_TARGET': {
      return {
        ...initialState,
        mode: state.mode,
        targetWins: action.target,
      }
    }

    default:
      return state
  }
}
