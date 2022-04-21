import { fork } from 'redux-saga/effects';

import { shootsWatch } from './shoots';

export function* sagas() {
  yield fork(shootsWatch);
}
