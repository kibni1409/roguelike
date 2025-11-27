import { Flex } from 'antd';

import { Border } from '../Border';
import { Plants } from '../Plants';
import { Enemies } from '../Enemies';
import { Bullets } from '../Bullets';
import { useScreenParams, useKeyboardControls } from '../../hooks';

import styles from './Field.module.scss';

export const Field = () => {
  const { position } = useKeyboardControls();
  const { fieldWidth, fieldHeight } = useScreenParams();

  return (
    <Flex
      className={styles.Field}
      style={{
        width: fieldWidth,
        height: fieldHeight,
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <Enemies />
      <Border />
      <Plants />
      <Bullets />
    </Flex>
  );
};
