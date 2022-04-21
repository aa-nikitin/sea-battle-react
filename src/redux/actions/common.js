import { createActions } from 'redux-actions';

const {
  start: { set: setStartParams },
  finish: { set: setFinishParams }
} = createActions({
  START: {
    SET: null
  },
  FINISH: {
    SET: null
  }
});

export { setStartParams, setFinishParams };
