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
      const nextState = produce(state, (draft) => {
        draft[pointY][pointX] = shipId > 0 ? 1 : -2;
      });

      return nextState;
    }
  },
  []
);
const findShip = handleActions(
  {
    [setStartParams]: () => ({}),
    [setComputerShoot]: (state, { payload }) => {
      const { shipId, pointX, pointY, shipsPlayer, shootsComputer } = payload;
      const widthField = shootsComputer[0].length;
      const heightField = shootsComputer.length;
      if (shipId > 0) {
        const insdexShip = _.findIndex(shipsPlayer, function (elem) {
          return elem.idShip === shipId;
        });
        const { decks } = shipsPlayer[insdexShip];

        if (decks === 1) return {};

        // если корабль подбит и в нем больше 1-ой палубы, смотрим соседние клетки
        if (!state.shipId) {
          const sides = [];
          if (pointX - 1 >= 0 && shootsComputer[pointY][pointX - 1] === 0)
            sides.push([pointX - 1, pointY]);
          if (pointX + 1 < widthField && shootsComputer[pointY][pointX + 1] === 0)
            sides.push([pointX + 1, pointY]);
          if (pointY - 1 >= 0 && shootsComputer[pointY - 1][pointX] === 0)
            sides.push([pointX, pointY - 1]);
          if (pointY + 1 < heightField && shootsComputer[pointY + 1][pointX] === 0)
            sides.push([pointX, pointY + 1]);

          const nextState = produce(state, (draft) => {
            draft.shipId = shipId;
            draft.decks = decks;
            draft.hits = 1;
            draft.coords = [pointX, pointY];
            draft.sides = sides;
          });

          return nextState;
        } else {
          //выбираем дальнейшее направление если попали второй раз
          const hits = state.hits + 1;
          const sides = [];

          if (decks === hits) return {}; //если корабль подбит сбрасываем параметры поиска

          const direction = state.coords[1] === pointY ? true : false;
          const nextDirection = direction ? pointX - state.coords[0] : pointY - state.coords[1];
          const nextStep = nextDirection > 0 ? +1 : -1;
          const nextShoot = direction ? [pointX + nextStep, pointY] : [pointX, pointY + nextStep];
          const prevShoot = direction
            ? [state.coords[0] + nextStep * -1, pointY]
            : [pointX, state.coords[1] + nextStep * -1];
          [nextShoot, prevShoot].forEach((element) => {
            if (
              element[0] >= 0 &&
              element[0] < widthField &&
              element[1] >= 0 &&
              element[1] < heightField &&
              shootsComputer[element[1]][element[0]] === 0
            )
              sides.push(element);
          });

          const nextState = produce(state, (draft) => {
            draft.hits = hits;
            draft.sides = sides;
            draft.turn = [];
          });

          return nextState;
        }
      } else {
        //в случае промах исключаем ячейку для удара из списка
        if (state.sides) {
          const nextState = produce(state, (draft) => {
            const newSides = state.sides.filter((item) => item[0] !== pointX || item[1] !== pointY);

            draft.sides = newSides;
          });

          return nextState;
        }
      }

      return {};
    }
  },
  {}
);

export const getComputer = ({ computer }) => computer;

export default combineReducers({ field, ships, shoots, findShip });
