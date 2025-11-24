import { useGrass } from '../../hooks';

import { Grass } from './Grass';

export const Plants = () => {
  const { grass } = useGrass();
  return (
    <>
      {grass.map(g => (
        <Grass
          id={g.id}
          top={g.top}
          left={g.left}
        />
      ))}
    </>
  );
};
