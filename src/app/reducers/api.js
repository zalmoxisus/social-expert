import { Map } from 'immutable';
import { reducer } from '../utils/createReducer';
import {
  LOGIN, LOGOUT,
  FEED, FEED_REMOVE, MARK,
  SUBS, SUBS_REORDER, DISPLAY
} from '../constants/ActionTypes';
import { removeEntity } from '../utils/feedUtils';
import { storeSubs, reorderSubs } from '../utils/subsUtils';

export const auth = (state = new Map(), action) => (
  action.type === LOGOUT ? new Map() : reducer(LOGIN, state, action)
);

export const feed = (state = new Map(), action) => (
  action.type === FEED_REMOVE
    ? removeEntity(state, action.host, action.id, action.targetId, action.targetName)
    : reducer(FEED, state, action)
);

export const marked = (state = new Map(), action) => reducer(MARK, state, action);

export const subs = (state = new Map(), action) => {
  switch (action.type) {
    case SUBS.SUCCESS:
      return storeSubs(state, action);
    case SUBS_REORDER:
      return reorderSubs(state, action);
    default:
      return reducer(SUBS, state, action);
  }
};

export const display = (state = new Map(), action) => {
  switch (action.type) {
    case DISPLAY.ORDER:
      return state.setIn([action.host, 'order'], action.order);
    case DISPLAY.SECTION:
      return state.setIn([action.host, 'section'], action.section);
    default:
      return state;
  }
};
