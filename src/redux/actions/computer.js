import { createActions } from 'redux-actions';

const {
  computer: { shoot: setComputerShoot }
} = createActions({
  COMPUTER: { SHOOT: null }
});

export { setComputerShoot };
