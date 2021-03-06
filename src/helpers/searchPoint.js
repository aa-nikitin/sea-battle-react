const searchPoint = (computer, player) => {
  let shootPoint = []; // координаты корабля
  const { field: fieldPlayer } = player;
  const { shoots: shootsComputer, findShip } = computer;

  if (!findShip.shipId) {
    // определяем случайную координату выстрела если нет обнаруженых кораблей
    const availableY = new Array(shootsComputer.length).fill().map((_, i) => i); // массив доступных точек Y
    while (!shootPoint.length) {
      const pointY = availableY[Math.floor(Math.random() * availableY.length)]; // случайная точка Y
      const availableX = []; // массив доступных точек X

      // формирование массива доступных точек X
      shootsComputer[pointY].forEach((val, idx) => {
        if (val === 0) availableX.push(idx);
      }); // если для точки Y нет ни одной свободной точки X, пропускаем итерацию и исключаем точку Y из массива availableY
      if (availableX <= 0) {
        const indexPointY = availableY.indexOf(pointY);

        if (indexPointY > 0) availableY.splice(indexPointY, 1);

        continue;
      }
      const pointX = availableX[Math.floor(Math.random() * availableX.length)]; // случайная точка X
      shootPoint = [pointX, pointY];
    }
  } else {
    // ищем другие палубы корабля если корабль был найден
    if (findShip.sides && findShip.sides.length > 0) {
      const randomCoords = findShip.sides[Math.floor(Math.random() * findShip.sides.length)];

      shootPoint = randomCoords;
    }
  }
  const [pointX, pointY] = shootPoint;
  const shipId = fieldPlayer[pointY][pointX];

  return { shipId, pointX, pointY };
};

export default searchPoint;
