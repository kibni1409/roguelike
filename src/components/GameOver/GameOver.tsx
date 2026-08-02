import { useHud } from '../../hooks/useGame';
import { restartFullGame } from '../../model/specifications';

import styles from './GameOver.module.scss';

export const GameOver = () => {
  const { phase, score, wave } = useHud();

  if (phase !== 'gameover') return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <h1 className={styles.title}>Game Over</h1>
        <div className={styles.stat}>SCORE: {score}</div>
        <div className={styles.stat}>WAVE REACHED: {wave}</div>
        <button
          type="button"
          className={styles.button}
          onClick={restartFullGame}
        >
          Play again
        </button>
      </div>
    </div>
  );
};
