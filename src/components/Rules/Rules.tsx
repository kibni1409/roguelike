import { Flex } from 'antd';

import KeysPNG from '../../assets/rules/frames/keys.png';
import MousePNG from '../../assets/rules/frames/mouse.png';
import LeftKeyPNG from '../../assets/rules/frames/leftKeyMouse.png';

export const Rules = () => {
  return (
    <Flex
      vertical
      gap={50}
      align="center"
      justify="center"
      style={{
        flex: 1,
      }}
    >
      <Flex
        gap={10}
        vertical
        align="center"
        justify="center"
      >
        <h2>MOVE PLAYER</h2>
        <img
          src={KeysPNG}
          alt={'KeysPNG'}
          style={{ width: 200, height: 100 }}
        />
      </Flex>
      <Flex
        gap={10}
        vertical
        align="center"
        justify="center"
      >
        <h2>MOVE AIM</h2>
        <img
          src={MousePNG}
          alt={'MousePNG'}
          style={{ width: 100, height: 100 }}
        />
      </Flex>
      <Flex
        gap={10}
        vertical
        align="center"
        justify="center"
      >
        <h2>SHOOT</h2>
        <img
          src={LeftKeyPNG}
          alt={'LeftKeyPNG'}
          style={{ width: 100, height: 100 }}
        />
      </Flex>

    </Flex>
  );
};
