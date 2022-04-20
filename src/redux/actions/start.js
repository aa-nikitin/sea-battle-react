import { createActions } from 'redux-actions';

const {
  start: { set: setStartParams }
} = createActions({
  START: {
    SET: null
  }
});

export { setStartParams };
