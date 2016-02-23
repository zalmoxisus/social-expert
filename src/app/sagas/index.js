import { takeEvery, takeLatest } from 'redux-saga';
import { LOCATION_CHANGE } from 'react-router-redux';
import { LOGIN, LOGOUT, FEED, MARK } from '../constants/ActionTypes';
import { onAuth, onLocationChange } from './auth';
import { onFetchFeed, setReloadTimeout } from './feed';
import onMarkAsRead from './mark';

export default function* rootSaga() {
  yield [
    takeLatest(LOGIN.REQUEST, onAuth),
    takeLatest(LOCATION_CHANGE, onLocationChange),
    takeLatest(FEED.REQUEST, onFetchFeed),
    takeLatest(FEED.SUCCESS, setReloadTimeout),
    takeLatest(MARK.REQUEST, onMarkAsRead)
  ];
}
