import { grassSprites } from '../../../assets';

type GrassProps = {
  id: number;
  top: number;
  left: number;
};

export const Grass = ({ id, top, left }: GrassProps) => {
  const size = 40;

  const randomIndex = id % grassSprites.length;
  const source = grassSprites[randomIndex];

  return (
    <div
      style={{
        top,
        left,
        zIndex: 1,
        fontSize: size,
        position: 'absolute',
      }}
    >
      <img
        src={source}
        alt={'grass'}
        style={{ zIndex: 1, width: size, height: size }}
      />
    </div>
  );
};
