import { useMemo } from 'react';

import _ from 'lodash';

type GrassItem = {
  id: number;
  top: number;
  left: number;
};

export const useGrass = () => {
  const grass = useMemo(() => {
    const items: GrassItem[] = [];
    const count = 30;

    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        top: _.random(0, 2000 - 30),
        left: _.random(0, 2000 - 30),
      });
    }
    return items;
  }, []);

  return { grass };
};
