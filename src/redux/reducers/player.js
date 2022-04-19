import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import produce from 'immer';
import { createSelector } from 'reselect';
import _ from 'lodash';

import { setStartParams, setPlayerShoot } from '../actions';

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
    [setStartParams]: (_state, { payload }) => payload.shootsPlayer,
    [setPlayerShoot]: (state, { payload }) => {
      const { x, y, fieldComputer, shipsComputer } = payload;
      const cellShoot = fieldComputer[y][x];
      // отметка выстрела (-2 - промох, 1 - попадание)
      const nextState = produce(state, (draft) => {
        draft[y][x] = cellShoot > 0 ? 1 : -2;
      });
      if (cellShoot > 0) {
        const insdexShip = _.findIndex(shipsComputer, function (elem) {
          return elem.idShip === cellShoot;
        });
        const shipWounds = shipsComputer[insdexShip]['wounds']
          ? shipsComputer[insdexShip]['wounds'] + 1
          : 1;
        const shipDecks = shipsComputer[insdexShip]['decks'];

        // если корабль уничтожен, находим и устанавливаем зону вокруг него
        if (shipWounds === shipDecks) {
          const { point, direction, decks } = shipsComputer[insdexShip];
          // console.log(point, direction, decks);
          const nextState2 = produce(nextState, (draft) => {
            for (let i = 0; i < decks; i++) {
              const [pointX, pointY] = direction
                ? [point[0] + i, point[1]]
                : [point[0], point[1] + i];
              const prevY = pointY - 1;
              const nextY = pointY + 1;
              const prevX = pointX - 1;
              const nextX = pointX + 1;

              if (direction) {
                if (prevY >= 0 && state[prevY][pointX] === 0) draft[prevY][pointX] = -1;
                if (nextY < state.length && state[nextY][pointX] === 0) draft[nextY][pointX] = -1;
                if (i === 0 && prevX >= 0) {
                  if (prevY >= 0 && state[prevY][prevX] === 0) draft[prevY][prevX] = -1;
                  if (state[pointY][prevX] === 0) draft[pointY][prevX] = -1;
                  if (nextY < state.length && state[nextY][prevX] === 0) draft[nextY][prevX] = -1;
                }
                if (i === decks - 1 && nextX < state[0].length) {
                  if (prevY >= 0 && state[prevY][nextX] === 0) draft[prevY][nextX] = -1;
                  if (state[pointY][nextX] === 0) draft[pointY][nextX] = -1;
                  if (nextY < state.length && state[nextY][nextX] === 0) draft[nextY][nextX] = -1;
                }
              } else {
                if (prevX >= 0 && state[pointY][prevX] === 0) draft[pointY][prevX] = -1;
                if (nextX < state.length && state[pointY][nextX] === 0) draft[pointY][nextX] = -1;
                if (i === 0 && prevY >= 0) {
                  if (prevX >= 0 && state[prevY][prevX] === 0) draft[prevY][prevX] = -1;
                  if (state[prevY][pointX] === 0) draft[prevY][pointX] = -1;
                  if (nextX < state.length && state[prevY][nextX] === 0) draft[prevY][nextX] = -1;
                }
                if (i === decks - 1 && nextY < state[0].length) {
                  if (prevX >= 0 && state[nextY][prevX] === 0) draft[nextY][prevX] = -1;
                  if (state[nextY][pointX] === 0) draft[nextY][pointX] = -1;
                  if (nextX < state.length && state[nextY][nextX] === 0) draft[nextY][nextX] = -1;
                }
              }
            }
          });

          return nextState2;
        }
      }
      // console.log(state, payload);
      return nextState;
    }
  },
  []
);

export const getPlayer = ({ player }) => player;

export const getPlayerShips = createSelector(
  (state) => state.player.ships,
  (ships) => {
    // console.log(ships);
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

export default combineReducers({ field, ships, shoots });
