import type { Score } from '../game/types'
import styles from './Scoreboard.module.css'

interface ScoreboardProps {
  score: Score
}

export default function Scoreboard({ score }: ScoreboardProps) {
  return (
    <div className={styles.scoreboard} role="region" aria-label="Scoreboard">
      <h2 className={styles.title}>Scoreboard</h2>
      <div className={styles.scores}>
        <div className={[styles.scoreCard, styles.x].join(' ')}>
          <span className={styles.player}>X</span>
          <span className={styles.value}>{score.X}</span>
          <span className={styles.label}>Wins</span>
        </div>
        <div className={[styles.scoreCard, styles.draws].join(' ')}>
          <span className={styles.player}>🤝</span>
          <span className={styles.value}>{score.draws}</span>
          <span className={styles.label}>Draws</span>
        </div>
        <div className={[styles.scoreCard, styles.o].join(' ')}>
          <span className={styles.player}>O</span>
          <span className={styles.value}>{score.O}</span>
          <span className={styles.label}>Wins</span>
        </div>
      </div>
    </div>
  )
}
