import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import produce from 'immer';
import _ from 'lodash';

import { setStartParams, setPlayerShoot } from '../actions';

const field = handleActions(
  {
    [setStartParams]: (_state, { payload }) => payload.fieldComputer
  },
  []
);
const ships = handleActions(
  {
    [setStartParams]: (_state, { payload }) => payload.shipsComputer,
    [setPlayerShoot]: (state, { payload }) => {
      const { x, y, fieldComputer, shipsComputer } = payload;
      const cellShoot = fieldComputer[y][x];

      if (cellShoot > 0) {
        const insdexShip = _.findIndex(shipsComputer, (elem) => elem.idShip === cellShoot);
        const shipWounds = shipsComputer[insdexShip]['wounds']
          ? shipsComputer[insdexShip]['wounds'] + 1
          : 1;
        const shipDecks = shipsComputer[insdexShip]['decks'];
        const nextState = produce(state, (draft) => {
          if (shipDecks === shipWounds) draft.splice(insdexShip, 1);
          else draft[insdexShip]['wounds'] = shipWounds;
        });

        return nextState;
      } else return state;
    }
  },
  []
);
const shoots = handleActions(
  {
    [setStartParams]: (_state, { payload }) => {
      console.log(payload);
      return payload.shootsComputer;
    }
  },
  []
);

export const getComputer = ({ computer }) => computer;

export default combineReducers({ field, ships, shoots });
