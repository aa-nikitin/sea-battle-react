import { createActions } from 'redux-actions';

const {
  start: { set: setStartParams }
} = createActions({
  START: {
    set: null
  }
});

export { setStartParams };
