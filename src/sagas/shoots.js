import { takeLatest, put, select, call } from 'redux-saga/effects';
import produce from 'immer';
import _ from 'lodash';

// import { fetchPost } from '../api';
import {
  setPlayerShoot,
  setComputerShoot,
  setStartParams,
  setPlayerWoundShip,
  setComputerWoundShip
} from '../redux/actions';
import { getPlayer, getComputer, getCommon } from '../redux/reducers';
// import { storageName } from '../config';

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

export function* shootComputer() {
  // логика стрельбы компьютера по полю пользователя
  try {
    // const token = localStorage.getItem(storageName);
    let delayShoot = new Promise(function (resolve) {
      setTimeout(() => resolve(), 500);
    });
    const player = yield select(getPlayer);
    const computer = yield select(getComputer);
    const { move } = yield select(getCommon);

    if (move === 'computer') {
      const pointShoot = yield call(searchPoint, computer, player);

      yield delayShoot;
      yield put(
        setComputerShoot({
          ...pointShoot,
          shipsPlayer: player.ships,
          shootsComputer: computer.shoots
        })
      );
      //   yield put(setComputerShoot('aaa'));
    }
    // yield put(setPlayerShoot({}));
  } catch (error) {}
}

const aaa = (move, waiter, attacker) => {
  const { shoots, lastShoot } = attacker;
  const { field: fieldWaiter, ships: shipsWaiter } = waiter;
  const [x, y] = lastShoot;
  const cellShoot = fieldWaiter[y][x];
  // console.log(cellShoot);
  if (cellShoot > 0) {
    const insdexShip = _.findIndex(shipsWaiter, (elem) => elem.idShip === cellShoot);
    const shipWounds = shipsWaiter[insdexShip]['wounds']
      ? shipsWaiter[insdexShip]['wounds'] + 1
      : 1;
    const shipDecks = shipsWaiter[insdexShip]['decks'];
    // console.log(move, attacker.lastShoot, cellShoot);

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

export function* shootHandler() {
  // логика стрельбы компьютера по полю пользователя
  try {
    const player = yield select(getPlayer);
    const computer = yield select(getComputer);
    const { move } = yield select(getCommon);

    // const [xPlayer, yPlayer] = player.lastShoot;
    // const [xComputer, yComputer] = computer.lastShoot;
    // const cellShootPlayer = computer.field[yPlayer][xPlayer];
    // const cellShootComputer = player.field[yComputer][xComputer];

    if (move === 'player') {
      const pointShoot = yield call(aaa, 'player', computer, player);
      if (pointShoot.cellShoot > 0 && pointShoot.move === 'player') {
        yield put(setPlayerWoundShip(pointShoot));
        console.log(pointShoot.shootAround);
      }
    }
    if (move === 'computer') {
      const pointShoot = yield call(aaa, 'computer', player, computer);
      if (pointShoot.cellShoot > 0 && pointShoot.move === 'computer')
        yield put(setComputerWoundShip(pointShoot));
    }
  } catch (error) {}
}

export function* shootsWatch() {
  yield takeLatest(setPlayerShoot, shootComputer);
  yield takeLatest(setComputerShoot, shootComputer);
  yield takeLatest(setStartParams, shootComputer);
  yield takeLatest(setPlayerShoot, shootHandler);
  yield takeLatest(setComputerShoot, shootHandler);
}
