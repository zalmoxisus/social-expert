import { takeEvery, takeLatest } from 'redux-saga';
import { LOCATION_CHANGE } from 'react-router-redux';
import { LOGIN, LOGOUT, FEED, MARK, SUBS } from '../constants/ActionTypes';
import { authorize, checkAuth } from './auth';
import { loadFeed, setReloadTimeout } from './feed';
import { loadSubscriptions } from './subs';
import markPostAsRead from './mark';

export default function* rootSaga() {
  yield [
    takeLatest(LOGIN.REQUEST, authorize),
    takeLatest(LOCATION_CHANGE, checkAuth),
    takeLatest(FEED.REQUEST, loadFeed),
    takeLatest(FEED.SUCCESS, setReloadTimeout),
    takeEvery(MARK.REQUEST, markPostAsRead),
    takeLatest(SUBS.REQUEST, loadSubscriptions)
  ];
}
