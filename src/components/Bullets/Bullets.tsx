import { useBulletIds } from '../../hooks/useGame';

import { BulletEntity } from './BulletEntity';

export const Bullets = () => {
  const bulletIds = useBulletIds();

  return (
    <>
      {bulletIds.map(id => (
        <BulletEntity
          id={id}
          key={id}
        />
      ))}
    </>
  );
};
