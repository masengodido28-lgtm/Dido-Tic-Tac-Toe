import { useEffect, useReducer, useRef, useState } from 'react'
import Board from './components/Board'
import StatusBar from './components/StatusBar'
import Scoreboard from './components/Scoreboard'
import MoveHistory from './components/MoveHistory'
import ModeSelector from './components/ModeSelector'
import { gameReducer, initialState } from './game/reducer'
import { getWinningLine } from './game/logic'
import { getBestMove } from './game/ai'
import type { GameMode } from './game/types'
import styles from './App.module.css'

// Delay before CPU plays (ms) — feels more natural
const CPU_DELAY = 450

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const [isCpuThinking, setIsCpuThinking] = useState(false)

  const {
    board,
    currentPlayer,
    winner,
    isDraw,
    history,
    stepIndex,
    score,
    mode,
    cpuPlayer,
    nextStartingPlayer,
  } = state

  const winningLine = getWinningLine(board)
  const gameOver = winner !== null || isDraw
  const isViewingHistory = stepIndex < history.length - 1

  // Track whether a CPU move is already scheduled to avoid double-firing
  const cpuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // CPU auto-move effect
  useEffect(() => {
    // Only trigger when: cpu mode, cpu's turn, game not over, viewing latest
    if (
      mode !== 'cpu' ||
      currentPlayer !== cpuPlayer ||
      gameOver ||
      isViewingHistory
    ) {
      return
    }

    setIsCpuThinking(true)

    cpuTimerRef.current = setTimeout(() => {
      const move = getBestMove(board.slice(), cpuPlayer)
      if (move !== -1) {
        dispatch({ type: 'MAKE_MOVE', index: move })
      }
      setIsCpuThinking(false)
    }, CPU_DELAY)

    return () => {
      if (cpuTimerRef.current) clearTimeout(cpuTimerRef.current)
    }
  }, [board, currentPlayer, mode, cpuPlayer, gameOver, isViewingHistory])

  function handleSquareClick(index: number) {
    // Block human clicks when CPU is thinking or it's CPU's turn
    if (mode === 'cpu' && currentPlayer === cpuPlayer && !isViewingHistory) return
    dispatch({ type: 'MAKE_MOVE', index })
  }

  function handleReset() {
    setIsCpuThinking(false)
    if (cpuTimerRef.current) clearTimeout(cpuTimerRef.current)
    dispatch({ type: 'RESET' })
  }

  function handleJumpTo(step: number) {
    setIsCpuThinking(false)
    if (cpuTimerRef.current) clearTimeout(cpuTimerRef.current)
    dispatch({ type: 'JUMP_TO', step })
  }

  function handleModeChange(newMode: GameMode) {
    setIsCpuThinking(false)
    if (cpuTimerRef.current) clearTimeout(cpuTimerRef.current)
    dispatch({ type: 'SET_MODE', mode: newMode })
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
        <ModeSelector mode={mode} onChange={handleModeChange} />
        <p className={styles.startInfo}>
          Next game starts: <strong>{nextStartingPlayer}</strong>
        </p>
      </header>

      {/* Main layout */}
      <main className={styles.main}>
        {/* Left: move history */}
        <aside className={styles.aside}>
          <MoveHistory
            history={history}
            currentStep={stepIndex}
            onJumpTo={handleJumpTo}
          />
        </aside>

        {/* Center: game */}
        <section className={styles.game}>
          <StatusBar
            winner={winner}
            isDraw={isDraw}
            currentPlayer={currentPlayer}
            isViewingHistory={isViewingHistory}
            viewingStep={stepIndex}
            mode={mode}
            cpuPlayer={cpuPlayer}
            isCpuThinking={isCpuThinking}
          />

          <Board
            board={board}
            winningLine={winningLine}
            gameOver={(gameOver && !isViewingHistory) || (mode === 'cpu' && currentPlayer === cpuPlayer && !gameOver && !isViewingHistory)}
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

        {/* Right: scoreboard */}
        <aside className={styles.aside}>
          <Scoreboard score={score} />
        </aside>
      </main>
    </div>
  )
}
