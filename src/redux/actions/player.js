import { createActions } from 'redux-actions';

const {
  player: { shoot: setPlayerShoot }
} = createActions({
  PLAYER: { SHOOT: null }
});

export { setPlayerShoot };
