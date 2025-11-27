import { useEnemies } from '../../hooks';

import { BigZ } from './BigZ';
import { LittleZ } from './LittleZ';
import { MiddleZ } from './MiddleZ';

export const Enemies = () => {
  const { enemies } = useEnemies();

  const enemyComponents = {
    bigZ: BigZ,
    littleZ: LittleZ,
    middleZ: MiddleZ,
  };

  return (
    <>
      {enemies.map((enemy) => {
        const Component = enemyComponents[enemy.type];
        return Component
          ? (
            <Component
              enemy={enemy}
              key={enemy.id}
            />
          )
          : null;
      })}
    </>
  );
};
