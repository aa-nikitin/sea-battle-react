import React from 'react';

import FieldCell from './FieldCell';

const Battlefield = ({ field, typeField }) => {
  return (
    <div className="battlefield">
      {field.map((horizontLine, y) =>
        horizontLine.map((value, x) => (
          <FieldCell key={`${y}-${x}-${value}`} value={value} typeField={typeField} x={x} y={y} />
        ))
      )}
    </div>
  );
};

export default Battlefield;
