import React from 'react';

const FieldCell = ({ value, typeField, x, y }) => {
  const borderClass = `${y === 0 ? ' battlefield--hide-top-border' : ''}${
    x === 0 ? ' battlefield--hide-left-border' : ''
  }`;
  const clickableClass = typeField === 'shoots' ? ' battlefield--is-clickable' : '';

  const handleClick = () => {
    if (typeField === 'shoots') {
      console.log(x, y);
    }
  };

  return (
    <div className={`battlefield__item ${borderClass}${clickableClass}`} onClick={handleClick}>
      {value > 0 ? value : ''}
    </div>
  );
};

export default FieldCell;
