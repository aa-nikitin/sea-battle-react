import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getComputer, getPlayerShips } from '../redux/reducers';

import FieldCell from './FieldCell';
import { setPlayerShoot } from '../redux/actions';

const Battlefield = ({ field, typeField }) => {
  const dispatch = useDispatch();
  const { field: fieldComputer, ships: shipsComputer } = useSelector((state) => getComputer(state));
  const playerShips = useSelector((state) => getPlayerShips(state));
  //   console.log(aaa);

  const handleClickCell = (params) => {
    const { x, y, value } = params;

    if (typeField === 'shoots' && value === 0) {
      dispatch(
        setPlayerShoot({
          x,
          y,
          fieldComputer,
          shipsComputer
        })
      );
    }
  };

  return (
    <div className="battlefield">
      {field.map((horizontLine, y) =>
        horizontLine.map((value, x) => (
          <FieldCell
            key={`${y}-${x}-${value}`}
            value={value}
            typeField={typeField}
            x={x}
            y={y}
            handleClickCell={handleClickCell}
          />
        ))
      )}
      {typeField === 'ships' && (
        <div className="battlefield__ships player-ships">
          {playerShips.map(({ top, left, width, height, idShip }) => {
            return (
              <div
                key={idShip}
                className="player-ships__item"
                style={{ top, left, width, height }}></div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Battlefield;
