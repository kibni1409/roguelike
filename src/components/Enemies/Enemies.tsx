import { useEnemies } from '../../hooks';

import styles from './Enemies.module.scss';

export const Enemies = () => {
  const { enemies } = useEnemies();

  return (
    <>
      {enemies.map(enemy => (
        <div
          key={enemy.id}
          className={styles.Enemies}
          style={{
            top: enemy.y,
            left: enemy.x,
            position: 'absolute',
          }}
        >
          🌳
        </div>
      ))}
    </>
  );
};
