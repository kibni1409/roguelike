import { useRef, useEffect } from 'react';

import { gifsPlayer } from '../../assets';
import { world, registerPlayerDom } from '../../game';

import styles from './Player.module.scss';

export const Player = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { isStep, orientation } = world.player;
  const initialGif = gifsPlayer[orientation][isStep ? 'run' : 'stay'];

  useEffect(() => {
    registerPlayerDom(rootRef.current, imgRef.current);
    return () => registerPlayerDom(null, null);
  }, []);

  return (
    <div
      ref={rootRef}
      className={styles.player}
    >
      <img
        ref={imgRef}
        src={initialGif}
        className={styles.sprite}
        alt={`${orientation} ${isStep ? 'run' : 'stay'} gif`}
      />
    </div>
  );
};
