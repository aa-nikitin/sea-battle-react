import { takeLatest, call, put, select } from 'redux-saga/effects';

// import { fetchPost } from '../api';
import { setPlayerShoot, setComputerShoot } from '../redux/actions';
import { getPlayer, getComputer, getCommon } from '../redux/reducers';
// import { storageName } from '../config';

// export function* getFinanceAll() {
//   try {
//     const token = localStorage.getItem(storageName);
//     const { query } = yield select(getFinance);
//     const finance = yield call(fetchPost, '/api/finance', query, token);
//     // const totalPayments = yield call(fetchGet, `/api/payments-total/${query.idPlan}`, {}, token);

//     yield put(financeGetSuccess({ list: finance.paymentPlan, total: finance.total }));
//   } catch (error) {
//     if (error === 'Unauthorized') yield put(logoutFetchFromToken());
//     yield put(financeGetError(error));
//   }
// }

const searchPoint = (shootsComputer, fieldPlayer) => {
  let shootPoint = []; // координаты корабля
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
  const [pointX, pointY] = shootPoint;
  const shipId = fieldPlayer[pointY][pointX];
  //   if (enemyShipId > 0) {
  //     console.log(pointX, pointY, enemyShipId);
  //   }
  return { shipId, pointX, pointY };
};

export function* shootComputer() {
  try {
    // const token = localStorage.getItem(storageName);
    let promise = new Promise(function (resolve, reject) {
      // эта функция выполнится автоматически, при вызове new Promise

      // через 1 секунду сигнализировать, что задача выполнена с результатом "done"
      setTimeout(() => resolve(), 500);
    });
    const player = yield select(getPlayer);
    const computer = yield select(getComputer);
    const { move } = yield select(getCommon);
    // const finance = yield call(fetchPost, '/api/finance', query, token);
    // // const totalPayments = yield call(fetchGet, `/api/payments-total/${query.idPlan}`, {}, token);
    if (move === 'computer') {
      const aaa = searchPoint(computer.shoots, player.field);
      yield promise;
      yield put(setComputerShoot(aaa));
      //   yield put(setComputerShoot('aaa'));
    }
    // yield put(setPlayerShoot({}));
  } catch (error) {
    // if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    // yield put(financeGetError(error));
  }
}

export function* computerWatch() {
  yield takeLatest(setPlayerShoot, shootComputer);
  yield takeLatest(setComputerShoot, shootComputer);
}
