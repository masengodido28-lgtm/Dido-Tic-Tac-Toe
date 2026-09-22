import { useEffect, useReducer, useRef, useState } from 'react'
import { Play, RotateCcw, RefreshCw, Trash2 } from 'lucide-react'
import Board from './components/Board'
import StatusBar from './components/StatusBar'
import Scoreboard from './components/Scoreboard'
import MoveHistory from './components/MoveHistory'
import ModeSelector from './components/ModeSelector'
import ThemePicker, { THEMES } from './components/ThemePicker'
import type { XOTheme } from './components/ThemePicker'
import { gameReducer, initialState } from './game/reducer'
import { getWinningLine } from './game/logic'
import { getBestMove } from './game/ai'
import type { GameMode } from './game/types'
import styles from './App.module.css'

const CPU_DELAY = 450

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const [isCpuThinking, setIsCpuThinking] = useState(false)
  const [theme, setTheme] = useState<XOTheme>(THEMES[0])

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
  const cpuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Apply theme colors as CSS custom properties on #root
  useEffect(() => {
    const root = document.getElementById('root')
    if (!root) return
    root.style.setProperty('--x-color', theme.xColor)
    root.style.setProperty('--o-color', theme.oColor)
  }, [theme])

  // CPU auto-move
  useEffect(() => {
    if (
      mode !== 'cpu' ||
      currentPlayer !== cpuPlayer ||
      gameOver ||
      isViewingHistory
    ) return

    setIsCpuThinking(true)
    cpuTimerRef.current = setTimeout(() => {
      const move = getBestMove(board.slice(), cpuPlayer)
      if (move !== -1) dispatch({ type: 'MAKE_MOVE', index: move })
      setIsCpuThinking(false)
    }, CPU_DELAY)

    return () => { if (cpuTimerRef.current) clearTimeout(cpuTimerRef.current) }
  }, [board, currentPlayer, mode, cpuPlayer, gameOver, isViewingHistory])

  function clearCpuTimer() {
    setIsCpuThinking(false)
    if (cpuTimerRef.current) clearTimeout(cpuTimerRef.current)
  }

  function handleSquareClick(index: number) {
    if (mode === 'cpu' && currentPlayer === cpuPlayer && !isViewingHistory) return
    dispatch({ type: 'MAKE_MOVE', index })
  }

  function handleRestart() {
    clearCpuTimer()
    dispatch({ type: 'RESTART' })
  }

  function handleNewGame() {
    clearCpuTimer()
    dispatch({ type: 'RESET' })
  }

  function handleFullReset() {
    clearCpuTimer()
    dispatch({ type: 'FULL_RESET' })
  }

  function handleJumpTo(step: number) {
    clearCpuTimer()
    dispatch({ type: 'JUMP_TO', step })
  }

  function handleModeChange(newMode: GameMode) {
    clearCpuTimer()
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

        <div className={styles.controls}>
          <ModeSelector mode={mode} onChange={handleModeChange} />
          <ThemePicker activeId={theme.id} onChange={setTheme} />
        </div>

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
            gameOver={
              (gameOver && !isViewingHistory) ||
              (mode === 'cpu' && currentPlayer === cpuPlayer && !gameOver && !isViewingHistory)
            }
            onSquareClick={handleSquareClick}
          />

          <div className={styles.actions}>
            {isViewingHistory && (
              <button
                className={[styles.btn, styles.btnResume].join(' ')}
                onClick={() => handleJumpTo(history.length - 1)}
              >
                <Play size={15} strokeWidth={2.5} />
                Resume
              </button>
            )}
            <button
              className={[styles.btn, styles.btnRestart].join(' ')}
              onClick={handleRestart}
              title="Restart this game (same starting player, score kept)"
            >
              <RotateCcw size={15} strokeWidth={2.5} />
              Restart
            </button>
            <button
              className={[styles.btn, styles.btnNewGame].join(' ')}
              onClick={handleNewGame}
              title="New game (starting player alternates)"
            >
              <RefreshCw size={15} strokeWidth={2.5} />
              New Game
            </button>
            <button
              className={[styles.btn, styles.btnFullReset].join(' ')}
              onClick={handleFullReset}
              title="Reset score and restart from scratch"
            >
              <Trash2 size={15} strokeWidth={2.5} />
              Reset Score
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
