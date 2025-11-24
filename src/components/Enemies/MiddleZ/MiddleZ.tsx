import type { Enemy } from '../../../shared';
import { giftsMiddleZ } from '../../../assets';

type MiddleZProps = {
  enemy: Enemy;
};

export const MiddleZ = ({ enemy }: MiddleZProps) => {
  const currentGif = giftsMiddleZ[enemy.orientation]['run'];
  const size = 80;
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
