export type Player = 'X' | 'O'
export type Cell = Player | null
export type Board = Cell[]
export type GameMode = 'pvp' | 'cpu'

export interface Score {
  X: number
  O: number
  draws: number
}

export interface HistoryEntry {
  board: Board
  currentPlayer: Player
  moveIndex: number // which cell was clicked (0-8), -1 for initial state
  movePlayer: Player | null
}

export interface GameState {
  /** Flat array of 9 cells */
  board: Board
  currentPlayer: Player
  winner: Player | null
  isDraw: boolean
  /** Full history of snapshots for time-travel */
  history: HistoryEntry[]
  /** Index into history we're currently viewing */
  stepIndex: number
  score: Score
  /** vs another player or vs CPU */
  mode: GameMode
  /** CPU always plays as O */
  cpuPlayer: Player
  /** Tracks whose turn it is to start next game (alternates each reset) */
  nextStartingPlayer: Player
}

export type GameAction =
  | { type: 'MAKE_MOVE'; index: number }
  | { type: 'RESET' }
  | { type: 'JUMP_TO'; step: number }
  | { type: 'SET_MODE'; mode: GameMode }
