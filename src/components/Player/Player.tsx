import { useKeyboardControls } from '../../hooks';

import styles from './Player.module.scss';

export const Player = () => {
  const { isStep, orientation } = useKeyboardControls();

  return (
    <div className={styles.player}>
      {orientation === 'left'
        ? isStep ? '<-' : '<'
        : isStep ? '->' : '>'}
    </div>
  );
};
