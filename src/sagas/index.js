import { fork } from 'redux-saga/effects';

import { computerWatch } from './computer';

export function* sagas() {
  yield fork(computerWatch);
}
