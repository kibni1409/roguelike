import type { Enemy } from '../../../shared';
import { giftsMiddleZ } from '../../../assets';

type MiddleZProps = {
  enemy: Enemy;
};

export const MiddleZ = ({ enemy }: MiddleZProps) => {
  const currentGif = giftsMiddleZ[enemy.orientation]['run'];

  return (
    <div
      style={{
        top: enemy.y,
        left: enemy.x,
        zIndex: enemy.zIndex,
        position: 'absolute',
      }}
    >
      <img
        src={currentGif}
        draggable="false"
        alt={`${enemy.orientation} run gif`}
        style={{
          width: enemy.width,
          userSelect: 'none',
          height: enemy.height,
          WebkitUserSelect: 'none',
        }}
      />
    </div>
  );
};
