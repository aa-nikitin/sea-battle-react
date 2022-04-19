import React from 'react';
// import { setTestParam } from '../redux/actions';
// import { useSelector, useDispatch } from 'react-redux';

// import { getTestParam } from '../redux/reducers';

import { useRandomField } from '../hooks';

const TestComponent = () => {
  // const dispatch = useDispatch();
  // const { testParam } = useSelector((state) => getTestParam(state));
  // console.log(testParam);
  // const aaa = useRandomField([4, 3, 3, 2, 2, 2, 1, 1, 1, 1]);
  const { fieldArr, allShips } = useRandomField({
    ships: [1, 1, 1, 1, 2, 2, 2, 3, 3, 4],
    widthField: 10,
    heightField: 10
  });
  console.log(allShips);

  // const handleClick = () => {
  //   // dispatch(setTestParam('test'));
  // };
  return (
    <div className="battlefield">
      {fieldArr.map((horizontLine, keyY) =>
        horizontLine.map((item, keyX) => (
          <div
            className={`battlefield__item ${keyY === 0 ? 'battlefield--hide-top-border' : ''} ${
              keyX === 0 ? 'battlefield--hide-left-border' : ''
            }`}
            key={`${keyY}${keyX}${item}`}>
            {item !== 0 && item !== -1 ? item : ''}
          </div>
        ))
      )}
    </div>
  );
};

export default TestComponent;
