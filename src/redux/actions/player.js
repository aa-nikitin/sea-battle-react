import { createActions } from 'redux-actions';

const {
  player: { shoot: setPlayerShoot, woundShip: setPlayerWoundShip }
} = createActions({
  PLAYER: { SHOOT: null, WOUND_SHIP: null }
});

export { setPlayerShoot, setPlayerWoundShip };
