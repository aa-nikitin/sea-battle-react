import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

import {
  setStartParams,
  setPlayerShoot,
  setComputerShoot,
  setPlayerWoundShip,
  setComputerWoundShip
} from '../actions';

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

const countShipsComputer = handleActions(
  {
    [setStartParams]: (_state, { payload: { shipsComputer } }) => shipsComputer.length,
    [setPlayerWoundShip]: (state, { payload }) => {
      const { shipDecks, shipWounds } = payload;

      if (shipDecks === shipWounds) return state - 1;

      return state;
    }
  },
  0
);

const countShipsPlayer = handleActions(
  {
    [setStartParams]: (_state, { payload: { shipsPlayer } }) => shipsPlayer.length,
    [setComputerWoundShip]: (state, { payload }) => {
      const { shipDecks, shipWounds } = payload;

      if (shipDecks === shipWounds) return state - 1;

      return state;
    }
  },
  0
);

const playerName = handleActions(
  {
    [setStartParams]: (_state, { payload: { namePlayer } }) => namePlayer
  },
  ''
);

export const getCommon = ({ common }) => common;

export default combineReducers({ move, countShipsComputer, countShipsPlayer, playerName });
