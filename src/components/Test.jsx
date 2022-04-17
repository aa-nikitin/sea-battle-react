import React from 'react';
import { setTestParam } from '../redux/actions';
import { useSelector, useDispatch } from 'react-redux';

import { getTestParam } from '../redux/reducers';

const TestComponent = () => {
  const dispatch = useDispatch();
  const { testParam } = useSelector((state) => getTestParam(state));
  console.log(testParam);

  const handleClick = () => {
    dispatch(setTestParam('test'));
  };
  return <div onClick={handleClick}>TestComponent</div>;
};

export default TestComponent;
