import { MouseEvent } from 'react';

import { Flex } from 'antd';

import { Field } from '../Field';
import { Player } from '../Player';
import { useBullets, useScreenParams } from '../../hooks';

import styles from './Container.module.scss';

export const Container = () => {
  const { screenWidth, screenHeight } = useScreenParams();
  const { shoot } = useBullets(); // Используем хук

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    shoot(mouseX, mouseY); // Стреляем
  };

  return (
    <Flex
      align="center"
      justify="center"
      onClick={handleClick} // Добавь обработчик
      className={styles.Container}
      style={{ flexShrink: 0, width: screenWidth, height: screenHeight }}
    >
      <Field />
      <Player />
    </Flex>
  );
};
