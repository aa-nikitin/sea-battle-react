import { createActions } from 'redux-actions';

const {
  params: { set: setTestParam }
} = createActions({
  PARAMS: {
    set: null
  }
});

export { setTestParam };
