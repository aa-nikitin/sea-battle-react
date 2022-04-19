import { combineReducers } from 'redux';
import player from './player';
import computer from './computer';

export * from './player';
export * from './computer';

export default combineReducers({ player, computer });
