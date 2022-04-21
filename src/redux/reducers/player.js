import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import produce from 'immer';
import { createSelector } from 'reselect';

import {
  setStartParams,
  setPlayerShoot,
  setComputerWoundShip,
  setPlayerWoundShip
} from '../actions';

const field = handleActions(
  {
    [setStartParams]: (_state, { payload }) => payload.fieldPlayer
  },
  []
);
const ships = handleActions(
  {
    [setStartParams]: (_state, { payload }) => payload.shipsPlayer,
    [setComputerWoundShip]: (state, { payload }) => {
      const { insdexShip, shipWounds, shipDecks } = payload;
      const nextState = produce(state, (draft) => {
        if (shipDecks > shipWounds) draft[insdexShip]['wounds'] = shipWounds;
      });

      return nextState;
    }
  },
  []
);
const lastShoot = handleActions(
  {
    [setPlayerShoot]: (_state, { payload: { x, y } }) => [x, y]
  },
  []
);
const shoots = handleActions(
  {
    [setStartParams]: (_state, { payload }) => payload.shootsPlayer,
    [setPlayerShoot]: (state, { payload }) => {
      const { x, y, fieldComputer } = payload;
      const cellShoot = fieldComputer[y][x];
      // отметка выстрела (-2 - промох, 1 - попадание)
      const nextState = produce(state, (draft) => {
        draft[y][x] = cellShoot > 0 ? 1 : -2;
      });
      return nextState;
    },
    [setPlayerWoundShip]: (state, { payload }) => {
      const { shipDecks, shipWounds, shootAround } = payload;

      if (shipDecks === shipWounds) return shootAround;

      return state;
    }
  },
  []
);

export const getPlayer = ({ player }) => player;

// формируем массив для отрисовки на поле кораблей пользователя
export const getPlayerShips = createSelector(
  (state) => state.player.ships,
  (ships) => {
    const sizeCell = 25;
    return ships.map((item) => {
      const {
        point: [pointX, pointY],
        direction,
        decks,
        idShip
      } = item;

      if (direction)
        return {
          top: pointY * sizeCell,
          left: pointX * sizeCell,
          width: decks * sizeCell,
          height: sizeCell,
          idShip
        };
      else
        return {
          top: pointY * sizeCell,
          left: pointX * sizeCell,
          width: sizeCell,
          height: decks * sizeCell,
          idShip
        };
    });
  }
);

export default combineReducers({ field, ships, shoots, lastShoot });
