import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as toastrReducer } from 'react-redux-toastr';
import * as api from './api';

const rootReducer = combineReducers({ ...api, routing: routerReducer, toastr: toastrReducer });

export default rootReducer;
