import type { Enemy } from '../../../shared';
import { giftsLittleZ } from '../../../assets';

type LittleZProps = {
  enemy: Enemy;
};

export const LittleZ = ({ enemy }: LittleZProps) => {
  const currentGif = giftsLittleZ[enemy.orientation]['run'];

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
