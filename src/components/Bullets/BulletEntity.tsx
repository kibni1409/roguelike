import { useRef, useEffect } from 'react';

import { getBullet, registerBulletDom } from '../../game';

import styles from '../Field/Field.module.scss';

type BulletEntityProps = {
  id: number;
};

export const BulletEntity = ({ id }: BulletEntityProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const bullet = getBullet(id);

  useEffect(() => {
    registerBulletDom(id, ref.current);
    return () => registerBulletDom(id, null);
  }, [id]);

  if (!bullet) return null;

  return (
    <div
      ref={ref}
      className={styles.bullet}
      style={{
        width: bullet.size,
        height: bullet.size,
        zIndex: bullet.zIndex,
        top: bullet.y - bullet.size / 2,
        left: bullet.x - bullet.size / 2,
      }}
    />
  );
};
