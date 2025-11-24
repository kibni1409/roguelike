import { Flex } from 'antd';

import { Border } from '../Border';
import { Plants } from '../Plants';
import { Enemies } from '../Enemies';
import { useScreenParams, useKeyboardControls } from '../../hooks';

import styles from './Field.module.scss';

export const Field = () => {
  const { fieldPosition } = useKeyboardControls();
  const { fieldWidth, fieldHeight } = useScreenParams();

  return (
    <Flex
      className={styles.Field}
      style={{
        width: fieldWidth,
        height: fieldHeight,
        transform: `translate(${fieldPosition.x}px, ${fieldPosition.y}px)`,
      }}
    >
      <Enemies />
      <Border />
      <Plants />
      <div
        className={styles.obstacle}
        style={{ top: 400, left: 500 }}
      >
        🏠
      </div>
      <div
        className={styles.obstacle}
        style={{ top: 600, left: 700 }}
      >
        💰
      </div>
    </Flex>
  );
};
