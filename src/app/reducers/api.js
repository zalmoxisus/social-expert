import { Map } from 'immutable';
import { reducer } from '../utils/createReducer';
import {
  LOGIN, LOGOUT,
  FEED, FEED_REMOVE, MARK,
  SUBS, SUBS_REORDER
} from '../constants/ActionTypes';
import { removeEntity, reorder } from '../utils/feedUtils';

export const auth = (state = new Map(), action) => (
  action.type === LOGOUT ? new Map() : reducer(LOGIN, state, action)
);

export const feed = (state = new Map(), action) => (
  action.type === FEED_REMOVE
    ? removeEntity(state, action.host, action.id, action.targetId, action.targetName)
    : reducer(FEED, state, action)
);

export const marked = (state = new Map(), action) => reducer(MARK, state, action);

export const subs = (state = new Map(), action) => (
  action.type === SUBS_REORDER
    ? reorder(state, action.host, action.fromObj, action.toObj)
    : reducer(SUBS, state, action)
);
