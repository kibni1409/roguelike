import { useEnemyIds } from '../../hooks/useGame';

import { EnemyEntity } from './EnemyEntity';

export const Enemies = () => {
  const enemyIds = useEnemyIds();

  return (
    <>
      {enemyIds.map(id => (
        <EnemyEntity
          id={id}
          key={id}
        />
      ))}
    </>
  );
};
