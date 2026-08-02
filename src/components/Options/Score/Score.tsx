import { Flex } from 'antd';

import { useHud, useBreakCountdown } from '../../../hooks/useGame';

import styles from './Score.module.scss';

export const Score = () => {
  const { hp, maxHp, score, wave, skillPoints, phase } = useHud();
  const breakSeconds = useBreakCountdown();

  return (
    <Flex
      vertical
      gap={8}
      align="center"
      className={styles.score}
    >
      <h1 className={styles.title}>{score}</h1>
      <div className={styles.row}>SCORE</div>
      <div className={styles.row}>HP: {hp} / {maxHp}</div>
      <div className={styles.row}>WAVE: {wave}</div>
      <div className={styles.row}>SKILL POINTS: {skillPoints}</div>
      {phase === 'break' && (
        <div className={styles.break}>
          NEXT WAVE IN {breakSeconds}S
        </div>
      )}
      {phase === 'fighting' && (
        <div className={styles.status}>FIGHT!</div>
      )}
    </Flex>
  );
};
