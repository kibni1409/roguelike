import { useEnemies } from '../../hooks';

import { BigZ } from './BigZ';
import { LittleZ } from './LittleZ';
import { MiddleZ } from './MiddleZ';

export const Enemies = () => {
  const { enemies } = useEnemies();

  return (
    <>
      {enemies.map((enemy) => {
        if (enemy.type === 'littleZ') {
          return (<LittleZ enemy={enemy} />);
        }
        if (enemy.type === 'middleZ') {
          return (<MiddleZ enemy={enemy} />);
        }
        if (enemy.type === 'bigZ') {
          return (<BigZ enemy={enemy} />);
        }
      })}
    </>
  );
};
