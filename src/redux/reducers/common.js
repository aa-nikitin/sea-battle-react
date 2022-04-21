import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
// import produce from 'immer';
// import _ from 'lodash';

import { setStartParams, setPlayerShoot, setComputerShoot } from '../actions';

const move = handleActions(
  {
    [setStartParams]: () => (Math.random() < 0.5 ? 'player' : 'computer'),
    [setPlayerShoot]: (_state, { payload }) => {
      const { x, y, fieldComputer } = payload;
      const cellShoot = fieldComputer[y][x];

      return cellShoot > 0 ? 'player' : 'computer';
    },
    [setComputerShoot]: (_state, { payload }) => {
      const { shipId } = payload;

      return shipId > 0 ? 'computer' : 'player';
    }
  },
  ''
);

export const getCommon = ({ common }) => common;

export default combineReducers({ move });
