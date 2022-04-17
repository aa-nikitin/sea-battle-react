import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

import { setTestParam } from '../actions';

const testParam = handleActions(
  {
    [setTestParam]: (_state, { payload }) => {
      return payload;
    }
  },
  ''
);

export const getTestParam = ({ test }) => test;

export default combineReducers({ testParam });
