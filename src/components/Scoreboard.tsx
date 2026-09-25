import { Minus, Crown } from 'lucide-react'
import type { Player, Score } from '../game/types'
import styles from './Scoreboard.module.css'

interface ScoreboardProps {
  score: Score
  targetWins: number
  seriesWinner: Player | null
}

function Pips({ filled, total, player }: { filled: number; total: number; player: 'x' | 'o' | 'draws' }) {
  return (
    <div className={styles.pips} aria-label={`${filled} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={[
            styles.pip,
            i < filled ? styles[`pipFilled_${player}`] : styles.pipEmpty,
          ].join(' ')}
        />
      ))}
    </div>
  )
}

export default function Scoreboard({ score, targetWins, seriesWinner }: ScoreboardProps) {
  return (
    <div className={styles.scoreboard} role="region" aria-label="Scoreboard">
      <h2 className={styles.title}>
        Race to {targetWins}
      </h2>
      <div className={styles.scores}>
        {/* X */}
        <div className={[
          styles.scoreCard,
          styles.x,
          seriesWinner === 'X' ? styles.champion : '',
        ].join(' ')}>
          {seriesWinner === 'X' && (
            <Crown size={16} strokeWidth={2.5} className={styles.crown} aria-label="Series winner" />
          )}
          <span className={styles.player}>X</span>
          <span className={styles.value}>{score.X}</span>
          <Pips filled={score.X} total={targetWins} player="x" />
          <span className={styles.label}>Wins</span>
        </div>

        {/* Draws */}
        <div className={[styles.scoreCard, styles.draws].join(' ')}>
          <span className={styles.player}>
            <Minus size={22} strokeWidth={3} />
          </span>
          <span className={styles.value}>{score.draws}</span>
          <span className={styles.label}>Draws</span>
        </div>

        {/* O */}
        <div className={[
          styles.scoreCard,
          styles.o,
          seriesWinner === 'O' ? styles.champion : '',
        ].join(' ')}>
          {seriesWinner === 'O' && (
            <Crown size={16} strokeWidth={2.5} className={styles.crown} aria-label="Series winner" />
          )}
          <span className={styles.player}>O</span>
          <span className={styles.value}>{score.O}</span>
          <Pips filled={score.O} total={targetWins} player="o" />
          <span className={styles.label}>Wins</span>
        </div>
      </div>
    </div>
  )
}
