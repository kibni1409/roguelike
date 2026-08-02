const KEYS = ['KeyW', 'KeyS', 'KeyA', 'KeyD'] as const;

type KeyCode = (typeof KEYS)[number];

const pressedKeys: Record<string, boolean> = {};

let attached = false;

const isGameKey = (code: string): code is KeyCode => {
  return (KEYS as readonly string[]).includes(code);
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (!isGameKey(event.code)) return;
  event.preventDefault();
  pressedKeys[event.code] = true;
};

const handleKeyUp = (event: KeyboardEvent) => {
  if (!isGameKey(event.code)) return;
  pressedKeys[event.code] = false;
};

export const attachInput = () => {
  if (attached) return;
  attached = true;
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
};

export const detachInput = () => {
  if (!attached) return;
  attached = false;
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  for (const key of KEYS) {
    pressedKeys[key] = false;
  }
};

export const getPressedKeys = () => pressedKeys;

export const hasPressedMovementKeys = () => {
  return KEYS.some(key => pressedKeys[key]);
};
