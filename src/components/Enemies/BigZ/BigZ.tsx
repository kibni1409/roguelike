import { giftsBigZ } from '../../../assets';
import type { Enemy } from '../../../shared';

type BigZProps = {
  enemy: Enemy;
};

export const BigZ = ({ enemy }: BigZProps) => {
  const currentGif = giftsBigZ[enemy.orientation]['run'];
  const size = 100;
  return (
    <div
      style={{
        top: enemy.y,
        left: enemy.x,
        fontSize: size,
        zIndex: enemy.zIndex,
        position: 'absolute',
      }}
    >
      <img
        src={currentGif}
        alt={`${enemy.orientation} run gif`}
        style={{ width: size, height: size }}
      />
    </div>
  );
};
