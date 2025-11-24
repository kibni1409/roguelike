import { Flex } from 'antd';

import { Score } from './Score';
import { Update } from './Update';

export const Options = () => {
  return (
    <Flex
      vertical
      align="center"
      justify="space-between"
      style={{
        flex: 1,
      }}
    >
      <Score />
      <Update />
    </Flex>
  );
};
