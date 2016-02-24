import { createRequestTypes } from '../utils/createAction';

export const LOGIN = createRequestTypes('LOGIN');
export const LOGOUT = 'LOGOUT';
export const FEED = createRequestTypes('FEED');
export const FEED_REMOVE = 'FEED_REMOVE';
export const MARK = createRequestTypes('MARK');
export const SUBS = createRequestTypes('SUBS');
export const SUBS_REORDER = 'SUBS_REORDER';
