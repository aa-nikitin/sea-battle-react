import { useCreateField } from './';

function compareNumeric(a, b) {
  if (a < b) return 1;
  if (a === b) return 0;
  if (a > b) return -1;
}

const useRandomField = ({ ships, widthField, heightField }) => {
  let fieldArr = useCreateField({ widthField, heightField }); // двумерный массив игрового поля
  let allShips = []; // корабли
  let isError = false; // true если не получилось расставить все корабли

  ships.sort(compareNumeric);

  const availableY = new Array(heightField).fill().map((_, i) => i); // массив доступных точек Y

  let attemptLimiter = 0;
  let idShip = 0;

  ships.forEach((decks) => {
    idShip++;
    let shipInfo = { point: [] }; // координаты корабля

    while (!shipInfo.point.length) {
      if (attemptLimiter > 100) {
        isError = true;
        break;
      } // ограничитель бесконечных повторений в случае невозможности расставить все корабли
      attemptLimiter++;
      const direction = Math.random() < 0.5; // определяем направление корабля [true - горизонталь, false - вертекаль]
      // const direction = false;
      const pointY = availableY[Math.floor(Math.random() * availableY.length)]; // случайная точка Y
      const availableX = []; // массив доступных точек X

      // формирование массива доступных точек X
      fieldArr[pointY].forEach((val, idx) => {
        if (val === 0) availableX.push(idx);
      });

      // если для точки Y нет ни одной свободной точки X, пропускаем итерацию и исключаем точку Y из массива availableY
      if (availableX <= 0) {
        const indexPointY = availableY.indexOf(pointY);

        if (indexPointY > 0) availableY.splice(indexPointY, 1);

        continue;
      }

      const pointX = availableX[Math.floor(Math.random() * availableX.length)]; // случайная точка X

      // проверяем можно ли разместить корабль с учетом полученных ранее координат
      if (direction) {
        // горизонтально
        let counterDec = 1;
        let startX = -1;
        let firstStage = true;
        for (let i = 0; i < decks; i++) {
          const incPointX = pointX + i;
          const decPointX = pointX - counterDec;
          if (incPointX < widthField && fieldArr[pointY][incPointX] === 0 && firstStage) {
            startX = pointX;
          } else if (decPointX >= 0 && fieldArr[pointY][decPointX] === 0) {
            firstStage = false;
            startX = decPointX;
            counterDec++;
          } else {
            startX = -1;
            break;
          }
        }
        if (startX === -1) continue;

        shipInfo = { point: [startX, pointY], direction };
      } else {
        // вертикально
        let counterDec = 1;
        let startY = -1;
        let firstStage = true;
        for (let i = 0; i < decks; i++) {
          const incPointY = pointY + i;
          const decPointY = pointY - counterDec;
          if (incPointY < heightField && fieldArr[incPointY][pointX] === 0 && firstStage) {
            startY = pointY;
          } else if (decPointY >= 0 && fieldArr[decPointY][pointX] === 0) {
            firstStage = false;
            startY = decPointY;
            counterDec++;
          } else {
            startY = -1;
            break;
          }
        }
        if (startY === -1) continue;

        shipInfo = { point: [pointX, startY], direction };
      }
    }

    // устанавливаем корабль на матрице
    if (shipInfo.point) {
      allShips.push({ ...shipInfo, decks, idShip });
      for (let i = 0; i < decks; i++) {
        const {
          point: [pointX, pointY],
          direction
        } = shipInfo;

        const blindSpot = -1; // зона вокруг корабля (обозначение)
        const current = (direction ? pointX : pointY) + i;
        const nextX = (direction ? current : pointX) + 1;
        const nextY = (direction ? pointY : current) + 1;
        const prevX = pointX - 1;
        const prevY = pointY - 1;

        if (direction) {
          // горизонтально
          if (current < widthField) {
            fieldArr[pointY][current] = idShip;
            if (prevY >= 0) fieldArr[prevY][current] = blindSpot;
            if (nextY < heightField) fieldArr[nextY][current] = blindSpot;
          }
          if (i === 0 && prevX >= 0) {
            if (prevY >= 0) fieldArr[prevY][prevX] = blindSpot;
            fieldArr[pointY][prevX] = blindSpot;
            if (nextY < heightField) fieldArr[nextY][prevX] = blindSpot;
          }
          if (i + 1 === decks && nextX < widthField) {
            if (prevY >= 0) fieldArr[prevY][nextX] = blindSpot;
            fieldArr[pointY][nextX] = blindSpot;
            if (nextY < heightField) fieldArr[nextY][nextX] = blindSpot;
          }
        } else {
          // вертикально
          if (current < heightField) {
            fieldArr[current][pointX] = idShip;
            if (prevX >= 0) fieldArr[current][prevX] = blindSpot;
            if (nextX < widthField) fieldArr[current][nextX] = blindSpot;
          }
          if (i === 0 && prevY >= 0) {
            if (prevX >= 0) fieldArr[prevY][prevX] = blindSpot;
            fieldArr[prevY][pointX] = blindSpot;
            if (nextX < widthField) fieldArr[prevY][nextX] = blindSpot;
          }
          if (i + 1 === decks && nextY < heightField) {
            if (prevX >= 0) fieldArr[nextY][prevX] = blindSpot;
            fieldArr[nextY][pointX] = blindSpot;
            if (nextX < widthField) fieldArr[nextY][nextX] = blindSpot;
          }
        }
      }
    }
  });

  return [fieldArr, allShips, isError];
};

export { useRandomField };
