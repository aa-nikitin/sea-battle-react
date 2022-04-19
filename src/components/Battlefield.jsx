import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getComputer } from '../redux/reducers';

import FieldCell from './FieldCell';
import { setPlayerShoot } from '../redux/actions';

const Battlefield = ({ field, typeField }) => {
  const dispatch = useDispatch();
  const { field: fieldComputer, ships: shipsComputer } = useSelector((state) => getComputer(state));

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
    </div>
  );
};

export default Battlefield;
