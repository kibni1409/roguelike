import { useRef, useEffect } from 'react';

import { Border } from '../Border';
import { Plants } from '../Plants';
import { Enemies } from '../Enemies';
import { Bullets } from '../Bullets';
import {
  world,
  FIELD_WIDTH,
  FIELD_HEIGHT,
  registerFieldDom,
} from '../../game';

import styles from './Field.module.scss';

export const Field = () => {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerFieldDom(fieldRef.current);
    return () => registerFieldDom(null);
  }, []);

  return (
    <div
      ref={fieldRef}
      className={styles.Field}
      style={{
        width: FIELD_WIDTH,
        height: FIELD_HEIGHT,
        transform: `translate(${world.fieldPosition.x}px, ${world.fieldPosition.y}px)`,
      }}
    >
      <Enemies />
      <Border />
      <Plants />
      <Bullets />
    </div>
  );
};
