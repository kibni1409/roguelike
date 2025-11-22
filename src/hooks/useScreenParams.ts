export const useScreenParams = () => {
  const fieldWidth = 2000;
  const fieldHeight = 2000;
  const moveStep = 5;
  const screenWidth = 900;
  const screenHeight = 800;
  const initialPosition = { x: -100, y: -100 };

  const maxX = -20;
  const minX = -(fieldWidth - screenWidth) - maxX;

  const maxY = -20;
  const minY = -(fieldHeight - screenHeight) - maxY;

  return {
    maxY,
    minY,
    maxX,
    minX,
    moveStep,
    fieldWidth,
    fieldHeight,
    screenWidth,
    screenHeight,
    initialPosition,
  };
};
