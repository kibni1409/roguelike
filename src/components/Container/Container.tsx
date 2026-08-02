import { MouseEvent } from 'react';

import { Flex } from 'antd';

import { Field } from '../Field';
import { Player } from '../Player';
import { GameOver } from '../GameOver';
import { shoot, useGameLoop } from '../../hooks/useGame';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../game';

import styles from './Container.module.scss';

export const Container = () => {
  useGameLoop();

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    shoot(mouseX, mouseY);
  };

  return (
    <Flex
      align="center"
      justify="center"
      onClick={handleClick}
      className={styles.Container}
      style={{ flexShrink: 0, width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
    >
      <Field />
      <Player />
      <GameOver />
    </Flex>
  );
};
