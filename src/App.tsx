import { Flex } from 'antd';

import { Rules, Options, Container } from './components';

export const App = () => {
  return (
    <Flex
      gap={20}
      style={{ width: '100vw' }}
    >
      <Rules />
      <Container />
      <Options />
    </Flex>
  );
};
