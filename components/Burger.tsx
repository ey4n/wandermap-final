import { useDisclosure } from '@mantine/hooks';
import { Burger, Stack } from '@mantine/core';

const Hello = () => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <div>
      <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" />
      {opened && (
        <div aria-hidden={!opened} role="dialog">
          <p>Hello world!</p>
        </div>
      )}
    </div>
  );
}

export default Hello;