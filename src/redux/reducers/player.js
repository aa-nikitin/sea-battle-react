import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

import { setStartParams } from '../actions';

const field = handleActions(
  {
    [setStartParams]: (_state, { payload }) => payload.fieldPlayer
  },
  []
);
const ships = handleActions(
  {
    [setStartParams]: (_state, { payload }) => payload.shipsPlayer
  },
  []
);
const shoots = handleActions(
  {
    [setStartParams]: (_state, { payload }) => payload.shootsPlayer
  },
  []
);

export const getPlayer = ({ player }) => player;

export default combineReducers({ field, ships, shoots });
