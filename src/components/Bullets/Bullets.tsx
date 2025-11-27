import { useBullets } from '../../hooks';

import styles from '../Field/Field.module.scss';

export const Bullets = () => {
  const { bullets } = useBullets();

  return (
    <>
      {bullets.map(bullet => (
        <div
          key={bullet.id}
          className={styles.bullet}
          style={{
            width: bullet.size,
            height: bullet.size,
            zIndex: bullet.zIndex,
            top: bullet.y - bullet.size / 2,
            left: bullet.x - bullet.size / 2,
          }}
        />
      ))}
    </>
  );
};
