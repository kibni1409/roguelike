import { Flex } from 'antd';

import { Field } from '../Field';
import { Rules } from '../Rules';
import { Player } from '../Player';
import { useScreenParams } from '../../hooks';

import styles from './Container.module.scss';

export const Container = () => {
  const { screenWidth, screenHeight } = useScreenParams();

  return (
    <Flex
      align="center"
      justify="center"
      className={styles.Container}
      style={{ width: screenWidth, height: screenHeight }}
    >
      <Field />
      <Player />
      <Rules />
    </Flex>
  );
};
