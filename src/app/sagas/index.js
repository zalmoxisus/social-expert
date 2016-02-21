import { takeEvery, takeLatest } from 'redux-saga';
import { LOCATION_CHANGE } from 'react-router-redux';
import { areDifferent } from '../utils/feedUtils';
import { LOGIN, LOGOUT, FEED, MARK } from '../constants/ActionTypes';
import { onAuth, onLocationChange } from './auth';
import { onFetchFeed, setReloadTimeout } from './feed';
import onMarkAsRead from './mark';

export default function* saga(getState) {
  const getToken = (host = 'github') => getState().auth[host];

  const isFeedEmpty = (host = 'github') => {
    const feed = getState().feed[host];
    return !feed || feed.result.length === 0;
  };

  const areNewPosts = (feed, host) => {
    const current = getState().feed[host];
    return current && areDifferent(current.result, feed.result);
  };

  yield [
    takeLatest(LOGIN.REQUEST, onAuth),
    takeLatest(LOCATION_CHANGE, onLocationChange, getToken),
    takeLatest(FEED.REQUEST, onFetchFeed, getToken, areNewPosts),
    takeLatest(FEED.SUCCESS, setReloadTimeout),
    takeLatest(MARK.REQUEST, onMarkAsRead, getToken, isFeedEmpty)
  ];
}
