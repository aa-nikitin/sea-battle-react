import produce from 'immer';
import _ from 'lodash';

const handleShoot = (move, waiter, attacker) => {
  const { shoots, lastShoot } = attacker;
  const { field: fieldWaiter, ships: shipsWaiter } = waiter;
  const [x, y] = lastShoot;
  const cellShoot = fieldWaiter[y][x];

  if (cellShoot > 0) {
    const insdexShip = _.findIndex(shipsWaiter, (elem) => elem.idShip === cellShoot);
    const shipWounds = shipsWaiter[insdexShip]['wounds']
      ? shipsWaiter[insdexShip]['wounds'] + 1
      : 1;
    const shipDecks = shipsWaiter[insdexShip]['decks'];

    let shootAround = [];
    if (shipWounds === shipDecks) {
      const { point, direction, decks } = shipsWaiter[insdexShip];
      shootAround = produce(shoots, (draft) => {
        for (let i = 0; i < decks; i++) {
          const [pointX, pointY] = direction ? [point[0] + i, point[1]] : [point[0], point[1] + i];
          const prevY = pointY - 1;
          const nextY = pointY + 1;
          const prevX = pointX - 1;
          const nextX = pointX + 1;

          if (direction) {
            if (prevY >= 0 && shoots[prevY][pointX] === 0) draft[prevY][pointX] = -1;
            if (nextY < shoots.length && shoots[nextY][pointX] === 0) draft[nextY][pointX] = -1;
            if (i === 0 && prevX >= 0) {
              if (prevY >= 0 && shoots[prevY][prevX] === 0) draft[prevY][prevX] = -1;
              if (shoots[pointY][prevX] === 0) draft[pointY][prevX] = -1;
              if (nextY < shoots.length && shoots[nextY][prevX] === 0) draft[nextY][prevX] = -1;
            }
            if (i === decks - 1 && nextX < shoots[0].length) {
              if (prevY >= 0 && shoots[prevY][nextX] === 0) draft[prevY][nextX] = -1;
              if (shoots[pointY][nextX] === 0) draft[pointY][nextX] = -1;
              if (nextY < shoots.length && shoots[nextY][nextX] === 0) draft[nextY][nextX] = -1;
            }
          } else {
            if (prevX >= 0 && shoots[pointY][prevX] === 0) draft[pointY][prevX] = -1;
            if (nextX < shoots.length && shoots[pointY][nextX] === 0) draft[pointY][nextX] = -1;
            if (i === 0 && prevY >= 0) {
              if (prevX >= 0 && shoots[prevY][prevX] === 0) draft[prevY][prevX] = -1;
              if (shoots[prevY][pointX] === 0) draft[prevY][pointX] = -1;
              if (nextX < shoots.length && shoots[prevY][nextX] === 0) draft[prevY][nextX] = -1;
            }
            if (i === decks - 1 && nextY < shoots[0].length) {
              if (prevX >= 0 && shoots[nextY][prevX] === 0) draft[nextY][prevX] = -1;
              if (shoots[nextY][pointX] === 0) draft[nextY][pointX] = -1;
              if (nextX < shoots.length && shoots[nextY][nextX] === 0) draft[nextY][nextX] = -1;
            }
          }
        }
      });
    }
    return { move, lastShoot, cellShoot, insdexShip, shipWounds, shipDecks, shootAround };
  }
};

export default handleShoot;
