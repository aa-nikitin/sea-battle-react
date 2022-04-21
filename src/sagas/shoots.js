import { takeLatest, put, select, call } from 'redux-saga/effects';

import {
  setPlayerShoot,
  setComputerShoot,
  setStartParams,
  setPlayerWoundShip,
  setComputerWoundShip
} from '../redux/actions';
import { getPlayer, getComputer, getCommon } from '../redux/reducers';
import searchPoint from '../helpers/searchPoint';
import handleShoot from '../helpers/handleShoot';

export function* shootComputer() {
  // логика стрельбы компьютера по полю пользователя
  try {
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
    }
  } catch (error) {}
}

export function* shootHandler() {
  // логика стрельбы компьютера по полю пользователя
  try {
    const player = yield select(getPlayer);
    const computer = yield select(getComputer);
    const { move, countShipsComputer, countShipsPlayer } = yield select(getCommon);

    if (move === 'player') {
      const pointShoot = yield call(handleShoot, 'player', computer, player);
      if (pointShoot.cellShoot > 0 && pointShoot.move === 'player') {
        yield put(setPlayerWoundShip({ ...pointShoot, countShipsComputer, countShipsPlayer }));
      }
    }
    if (move === 'computer') {
      const pointShoot = yield call(handleShoot, 'computer', player, computer);
      if (pointShoot.cellShoot > 0 && pointShoot.move === 'computer')
        yield put(setComputerWoundShip({ ...pointShoot, countShipsComputer, countShipsPlayer }));
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
