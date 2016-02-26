import { action } from '../utils/createAction';
import {
  LOGIN, LOGOUT,
  FEED, FEED_REMOVE, MARK,
  SUBS, SUBS_REORDER
} from '../constants/ActionTypes';

export const login = {
  request: (host) => action(LOGIN.REQUEST)({ host }),
  success: (payload) => action(LOGIN.SUCCESS)(payload),
  error: (error) => action(LOGIN.ERROR)({ error })
};

export const logout = action(LOGOUT);

export const removeFromFeed = (payload) => action(FEED_REMOVE)(payload);

export const fetchFeed = {
  request: (host) => action(FEED.REQUEST)({ host }),
  success: (payload) => action(FEED.SUCCESS)(payload),
  error: (error) => action(FEED.ERROR)({ error })
};

export const markAsRead = {
  request: (id, owner, target) => action(MARK.REQUEST)({ id, owner, target }),
  success: (payload) => action(MARK.SUCCESS)({ payload }),
  error: (error) => action(MARK.ERROR)({ error })
};

export const fetchSubs = {
  request: (host) => action(SUBS.REQUEST)({ host }),
  success: (payload) => action(SUBS.SUCCESS)(payload),
  error: (error) => action(SUBS.ERROR)({ error })
};

export const reorderSubs = (host, fromObj, toObj) => action(SUBS_REORDER)({ host, fromObj, toObj });
