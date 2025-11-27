import { giftsBigZ } from '../../../assets';
import type { Enemy } from '../../../shared';

type BigZProps = {
  enemy: Enemy;
};

export const BigZ = ({ enemy }: BigZProps) => {
  const currentGif = giftsBigZ[enemy.orientation]['run'];

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
          userSelect: 'none',
          width: enemy.width,
          height: enemy.height,
          WebkitUserSelect: 'none',
        }}
      />
    </div>
  );
};
