import React from 'react';

const FieldCell = ({ value, typeField, x, y, handleClickCell }) => {
  const borderClass = `${y === 0 ? ' battlefield--hide-top-border' : ''}${
    x === 0 ? ' battlefield--hide-left-border' : ''
  }`;
  const clickableClass = typeField === 'shoots' ? ' battlefield--is-clickable' : '';

  const handleClick = () => {
    handleClickCell({ x, y, value });
  };

  let cellClass = '';
  if (value > 0) cellClass = ' cell--hit';
  else if (value === -1) cellClass = ' cell--empty';
  else if (value === -2) cellClass = ' cell--miss';
  else cellClass = '';

  return (
    <div
      className={`battlefield__item cell ${borderClass}${clickableClass}${cellClass}`}
      onClick={handleClick}>
      {/* {value !== 0 ? value : ''} */}
    </div>
  );
};

export default FieldCell;
