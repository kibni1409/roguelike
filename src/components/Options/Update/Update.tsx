import { Flex, Button } from 'antd';

import { useHud } from '../../../hooks/useGame';
import { useSpecificationsWrapper } from '../../../model/specifications';

import styles from './Update.module.scss';

export const Update = () => {
  const { skillPoints } = useHud();
  const attack = useSpecificationsWrapper('attack');
  const speed = useSpecificationsWrapper('speed');
  const range = useSpecificationsWrapper('range');
  const reload = useSpecificationsWrapper('reload');
  const upgradeAttack = useSpecificationsWrapper('upgradeAttack');
  const upgradeSpeed = useSpecificationsWrapper('upgradeSpeed');
  const upgradeRange = useSpecificationsWrapper('upgradeRange');
  const upgradeReload = useSpecificationsWrapper('upgradeReload');

  const canUpgrade = skillPoints > 0;

  return (
    <Flex
      vertical
      gap={20}
      align="flex-end"
      className={styles.panel}
    >
      <h2 className={styles.title}>specifications</h2>
      <div className={styles.points}>
        Available points: {skillPoints}
      </div>
      <Flex
        gap={20}
        align="center"
      >
        <span className={styles.rowLabel}>{`speed: ${speed}`}</span>
        <Button
          disabled={!canUpgrade}
          onClick={() => upgradeSpeed()}
          className={`${styles.button} ${styles.buttonPlus}`}
        />
      </Flex>
      <Flex
        gap={20}
        align="center"
      >
        <span className={styles.rowLabel}>{`attack: ${attack}`}</span>
        <Button
          disabled={!canUpgrade}
          onClick={() => upgradeAttack()}
          className={`${styles.button} ${styles.buttonPlus}`}
        />
      </Flex>
      <Flex
        gap={20}
        align="center"
      >
        <span className={styles.rowLabel}>{`range: ${range}`}</span>
        <Button
          disabled={!canUpgrade}
          onClick={() => upgradeRange()}
          className={`${styles.button} ${styles.buttonPlus}`}
        />
      </Flex>
      <Flex
        gap={20}
        align="center"
      >
        <span className={styles.rowLabel}>{`reload: ${reload}`}</span>
        <Button
          disabled={!canUpgrade}
          onClick={() => upgradeReload()}
          className={`${styles.button} ${styles.buttonPlus}`}
        />
      </Flex>
    </Flex>
  );
};
