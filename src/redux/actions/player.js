import { createActions } from 'redux-actions';

const {
  field: { set: setPlayerField },
  ships: { set: setPlayerShips }
} = createActions({
  FIELD: {
    set: null
  },
  SHIPS: {
    set: null
  }
});

export { setPlayerField, setPlayerShips };
