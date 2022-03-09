import { combineReducers } from 'redux';
import todo from './todo';
import name from './name';

const todoApp = combineReducers({
    todo,
    name
})

export default todoApp