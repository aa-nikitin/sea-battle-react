import { combineReducers } from 'redux';
import player from './player';
import computer from './computer';
import common from './common';

export * from './player';
export * from './computer';
export * from './common';

export default combineReducers({ player, computer, common });
