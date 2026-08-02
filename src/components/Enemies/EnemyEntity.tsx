import { useRef, useEffect } from 'react';

import { giftsBigZ, giftsLittleZ, giftsMiddleZ } from '../../assets';
import { getEnemy, registerEnemyDom } from '../../game';
import type { EnemyType } from '../../shared';

import styles from './EnemyEntity.module.scss';

const gifsByType: Record<EnemyType, typeof giftsLittleZ> = {
  bigZ: giftsBigZ,
  littleZ: giftsLittleZ,
  middleZ: giftsMiddleZ,
};

type EnemyEntityProps = {
  id: number;
};

export const EnemyEntity = ({ id }: EnemyEntityProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const enemy = getEnemy(id);

  useEffect(() => {
    registerEnemyDom(id, rootRef.current, imgRef.current);
    return () => registerEnemyDom(id, null, null);
  }, [id]);

  if (!enemy) return null;

  const gif = gifsByType[enemy.type][enemy.orientation].run;

  return (
    <div
      ref={rootRef}
      className={styles.enemy}
      style={{
        top: enemy.y,
        left: enemy.x,
        zIndex: enemy.zIndex,
      }}
    >
      <img
        ref={imgRef}
        src={gif}
        alt={`${enemy.type} ${enemy.orientation}`}
        draggable={false}
        className={styles.sprite}
        style={{
          width: enemy.width,
          height: enemy.height,
        }}
      />
    </div>
  );
};
