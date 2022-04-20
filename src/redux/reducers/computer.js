import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import produce from 'immer';
import _ from 'lodash';

import { setStartParams, setPlayerShoot, setComputerShoot } from '../actions';

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
      }
      return state;
    }
  },
  []
);
const shoots = handleActions(
  {
    [setStartParams]: (_state, { payload }) => {
      return payload.shootsComputer;
    },
    [setComputerShoot]: (state, { payload }) => {
      const { shipId, pointX, pointY } = payload;
      console.log(payload);
      const nextState = produce(state, (draft) => {
        draft[pointY][pointX] = shipId > 0 ? 1 : -2;
      });
      console.log(nextState);
      return nextState;
    }
    // [setPlayerShoot]: (state, { payload }) => {
    //   // console.log(state, payload);
    //   const { x, y, fieldComputer, shipsComputer, fieldPlayer, shipsPlayer } = payload;
    //   const enemyShoot = fieldComputer[y][x];
    //   if (enemyShoot <= 0) {
    //     // const [pointX, pointY] = searchPoint(state);
    //     // const cellShoot = fieldPlayer[pointY][pointX];
    //     // const nextState = produce(state, (draft) => {
    //     //   draft[pointY][pointX] = cellShoot > 0 ? 1 : -2;
    //     // });
    //     // console.log(cellShoot);
    //     // return nextState;

    //     const aaa = searchPoint(state, payload);

    //     return state;
    //   }
    //   return state;
    // }
  },
  []
);

export const getComputer = ({ computer }) => computer;

export default combineReducers({ field, ships, shoots });
