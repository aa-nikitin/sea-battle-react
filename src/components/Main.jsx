import React from 'react';
import { setStartParams } from '../redux/actions';
import { useSelector, useDispatch } from 'react-redux';

import { getPlayer, getComputer, getCommon } from '../redux/reducers';

import { useRandomField, useCreateField } from '../hooks';

import Battlefield from '../components/Battlefield';

const Main = () => {
  const paramsBuildField = {
    ships: [1, 1, 1, 1, 2, 2, 2, 3, 3, 4],
    widthField: 10,
    heightField: 10
  };
  const [namePlayer, setNamePlayer] = React.useState('');
  const dispatch = useDispatch();
  const { shoots: shootsPlayer } = useSelector((state) => getPlayer(state));
  const { shoots: shootsComputer } = useSelector((state) => getComputer(state));
  const { countShipsComputer, countShipsPlayer, playerName, move } = useSelector((state) =>
    getCommon(state)
  );
  const winner = countShipsComputer === 0 ? 'player' : countShipsPlayer === 0 ? 'computer' : '';

  const [newFieldPlayer, newShipsPlayer, isNewErrorPlayer] = useRandomField(paramsBuildField);
  const [newFieldComputer, newShipsComputer, isNewErrorComputer] = useRandomField(paramsBuildField);
  const fieldShoots = useCreateField(paramsBuildField);

  const handleClick = () => {
    if (!isNewErrorPlayer && !isNewErrorComputer && namePlayer)
      dispatch(
        setStartParams({
          fieldPlayer: newFieldPlayer,
          shipsPlayer: newShipsPlayer,
          shootsPlayer: fieldShoots,
          fieldComputer: newFieldComputer,
          shipsComputer: newShipsComputer,
          shootsComputer: fieldShoots,
          namePlayer
        })
      );
  };

  const handleNamePlayer = ({ target: { value } }) => {
    setNamePlayer(value);
  };
  return (
    <>
      {!winner ? (
        <div className="main">
          <div className="main__item">
            <div className="main__name">Компьютер{move === 'computer' ? ' - ходит' : ''}</div>
            <Battlefield field={shootsComputer} typeField="ships" />
          </div>
          <div className="main__item">
            <div className="main__name">
              {playerName}
              {move === 'player' ? ' - ваш ход' : ''}
            </div>
            <Battlefield field={shootsPlayer} typeField="shoots" />
          </div>
        </div>
      ) : (
        <div className="start-panel">
          {!playerName ? (
            <div className="start-panel__box">
              <input
                className={`start-panel__name ${!namePlayer ? 'error' : ''}`}
                type="text"
                value={namePlayer}
                placeholder="Введите имя"
                onChange={handleNamePlayer}
              />
            </div>
          ) : (
            <div className="start-panel__message">
              {winner === 'player'
                ? 'Поздравляю Вы победили, хотите сыграть еще?'
                : 'К сожалению вы проиграли. Хотите попробовать еще?'}
            </div>
          )}

          <div className="start-panel__box">
            <button className="start-panel__button" onClick={handleClick}>
              Играть!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Main;
