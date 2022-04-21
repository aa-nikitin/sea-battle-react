import { createActions } from 'redux-actions';

const {
  computer: { shoot: setComputerShoot, woundShip: setComputerWoundShip }
} = createActions({
  COMPUTER: { SHOOT: null, WOUND_SHIP: null }
});

export { setComputerShoot, setComputerWoundShip };
