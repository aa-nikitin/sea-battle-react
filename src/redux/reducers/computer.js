import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

import { setStartParams } from '../actions';

const field = handleActions(
  {
    [setStartParams]: (_state, { payload }) => payload.fieldComputer
  },
  []
);
const ships = handleActions(
  {
    [setStartParams]: (_state, { payload }) => payload.shipsComputer
  },
  []
);
const shoots = handleActions(
  {
    [setStartParams]: (_state, { payload }) => payload.shootsComputer
  },
  []
);

export const getComputer = ({ computer }) => computer;

export default combineReducers({ field, ships, shoots });
