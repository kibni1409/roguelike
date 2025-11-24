import type { Enemy } from '../../../shared';
import { giftsLittleZ } from '../../../assets';

type LittleZProps = {
  enemy: Enemy;
};

export const LittleZ = ({ enemy }: LittleZProps) => {
  const currentGif = giftsLittleZ[enemy.orientation]['run'];
  const size = 70;
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
