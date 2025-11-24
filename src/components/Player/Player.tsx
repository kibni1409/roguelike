import { gifsPlayer } from '../../assets';
import { useKeyboardControls } from '../../hooks';

import styles from './Player.module.scss';

export const Player = () => {
  const { isStep, orientation } = useKeyboardControls();

  const currentGif = gifsPlayer[orientation][isStep ? 'run' : 'stay'];

  return (
    <div className={styles.player}>
      <img
        src={currentGif}
        style={{ width: 80, height: 80 }}
        alt={`${orientation} ${isStep ? 'run' : 'stay'} gif`}
      />
    </div>
  );
};
