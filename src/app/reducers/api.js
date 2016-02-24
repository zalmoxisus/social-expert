import { reducer } from '../utils/createReducer';
import {
  LOGIN, LOGOUT,
  FEED, FEED_REMOVE, MARK,
  SUBS, SUBS_REORDER
} from '../constants/ActionTypes';
import { removeEntity, reorder } from '../utils/feedUtils';

export const auth = (state, action) => (
  action.type === LOGOUT ? {} : reducer(LOGIN, state || {}, action)
);

export const feed = (state, action) => (
  action.type === FEED_REMOVE
    ? removeEntity(state, action.host, action.id, action.target)
    : reducer(FEED, state || {}, action)
);

export const marked = (state, action) => reducer(MARK, state || {}, action);

export const subs = (state, action) => (
  action.type === SUBS_REORDER
    ? reorder(state, action.host, action.fromObj, action.toObj)
    : reducer(SUBS, state || {}, action)
);
