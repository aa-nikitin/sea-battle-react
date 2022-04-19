import React from 'react';
import { setStartParams } from '../redux/actions';
import { useSelector, useDispatch } from 'react-redux';

import { getPlayer } from '../redux/reducers';

import { useRandomField, useCreateField } from '../hooks';

const Main = () => {
  const paramsBuildField = {
    ships: [1, 1, 1, 1, 2, 2, 2, 3, 3, 4],
    widthField: 10,
    heightField: 10
  };
  const dispatch = useDispatch();
  const { field: fieldPlayer /*, ships: shipsPlayer*/ } = useSelector((state) => getPlayer(state));

  const [newFieldPlayer, newShipsPlayer, isNewErrorPlayer] = useRandomField(paramsBuildField);
  const [newFieldComputer, newShipsComputer, isNewErrorComputer] = useRandomField(paramsBuildField);
  const fieldShoots = useCreateField(paramsBuildField);

  // console.log(testParam);
  // const aaa = useRandomField([4, 3, 3, 2, 2, 2, 1, 1, 1, 1]);

  console.log(fieldShoots);

  const handleClick = () => {
    console.log(isNewErrorPlayer);
    if (!isNewErrorPlayer)
      dispatch(
        setStartParams({
          fieldPlayer: newFieldPlayer,
          shipsPlayer: newShipsPlayer,
          shootsPlayer: fieldShoots,
          fieldComputer: newFieldComputer,
          shipsComputer: newShipsComputer,
          shootsComputer: isNewErrorComputer
        })
      );
  };
  return (
    <>
      <div className="battlefield">
        {fieldPlayer.map((horizontLine, keyY) =>
          horizontLine.map((item, keyX) => (
            <div
              className={`battlefield__item ${keyY === 0 ? 'battlefield--hide-top-border' : ''} ${
                keyX === 0 ? 'battlefield--hide-left-border' : ''
              }`}
              key={`${keyY}${keyX}${item}`}>
              {item > 0 ? item : ''}
            </div>
          ))
        )}
      </div>
      <div onClick={handleClick}>Начать</div>
    </>
  );
};

export default Main;
