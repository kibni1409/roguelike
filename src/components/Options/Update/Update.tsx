import cn from 'classnames';
import { Flex, Button } from 'antd';

import { useSpecificationsWrapper } from '../../../model/specifications';

import styles from './Update.module.scss';

export const Update = () => {
  const attack = useSpecificationsWrapper('attack');
  const speed = useSpecificationsWrapper('speed');
  const range = useSpecificationsWrapper('range');
  const setAttack = useSpecificationsWrapper('setAttack');
  const setSpeed = useSpecificationsWrapper('setSpeed');
  const setRange = useSpecificationsWrapper('setRange');

  return (
    <Flex
      vertical
      gap={20}
      align="flex-end"
    >
      <h2>specifications</h2>
      <Flex
        gap={20}
        align="center"
      >
        {`speed: ${speed}`}
        <Button
          onClick={() => setSpeed(speed + 1)}
          className={cn(styles.button, styles.buttonPlus)}
        />
      </Flex>
      <Flex
        gap={20}
        align="center"
      >
        {`attack: ${attack}`}
        <Button
          onClick={() => setAttack(attack + 1)}
          className={cn(styles.button, styles.buttonPlus)}
        />
      </Flex>
      <Flex
        gap={20}
        align="center"
      >
        {`range: ${range}`}
        <Button
          onClick={() => setRange(range + 1)}
          className={cn(styles.button, styles.buttonPlus)}
        />
      </Flex>
    </Flex>
  );
};
