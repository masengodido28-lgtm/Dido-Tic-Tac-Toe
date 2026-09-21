import { useReducer } from 'react'
import Board from './components/Board'
import StatusBar from './components/StatusBar'
import Scoreboard from './components/Scoreboard'
import MoveHistory from './components/MoveHistory'
import { gameReducer, initialState } from './game/reducer'
import { getWinningLine } from './game/logic'
import styles from './App.module.css'

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  const { board, currentPlayer, winner, isDraw, history, stepIndex, score } = state

  const winningLine = getWinningLine(board)
  const gameOver = winner !== null || isDraw
  const isViewingHistory = stepIndex < history.length - 1

  function handleSquareClick(index: number) {
    // If viewing history, make move from that point forward
    dispatch({ type: 'MAKE_MOVE', index })
  }

  function handleReset() {
    dispatch({ type: 'RESET' })
  }

  function handleJumpTo(step: number) {
    dispatch({ type: 'JUMP_TO', step })
  }

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.titleX}>X</span>
          <span className={styles.titleSep}> vs </span>
          <span className={styles.titleO}>O</span>
        </h1>
        <p className={styles.subtitle}>Tic Tac Toe</p>
      </header>

      {/* Main layout */}
      <main className={styles.main}>
        {/* Left column: history */}
        <aside className={styles.aside}>
          <MoveHistory
            history={history}
            currentStep={stepIndex}
            onJumpTo={handleJumpTo}
          />
        </aside>

        {/* Center column: game */}
        <section className={styles.game}>
          <StatusBar
            winner={winner}
            isDraw={isDraw}
            currentPlayer={currentPlayer}
            isViewingHistory={isViewingHistory}
            viewingStep={stepIndex}
          />

          <Board
            board={board}
            winningLine={winningLine}
            gameOver={gameOver && !isViewingHistory}
            onSquareClick={handleSquareClick}
          />

          <div className={styles.actions}>
            {isViewingHistory && (
              <button
                className={[styles.btn, styles.btnResume].join(' ')}
                onClick={() => handleJumpTo(history.length - 1)}
              >
                ▶ Resume Latest
              </button>
            )}
            <button
              className={[styles.btn, styles.btnReset].join(' ')}
              onClick={handleReset}
            >
              🔄 New Game
            </button>
          </div>
        </section>

        {/* Right column: scoreboard */}
        <aside className={styles.aside}>
          <Scoreboard score={score} />
        </aside>
      </main>
    </div>
  )
}
