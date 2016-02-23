import { takeEvery, takeLatest } from 'redux-saga';
import { LOCATION_CHANGE } from 'react-router-redux';
import { LOGIN, LOGOUT, FEED, MARK } from '../constants/ActionTypes';
import { authorize, checkAuth } from './auth';
import { loadFeed, setReloadTimeout } from './feed';
import markPostAsRead from './mark';

export default function* rootSaga() {
  yield [
    takeLatest(LOGIN.REQUEST, authorize),
    takeLatest(LOCATION_CHANGE, checkAuth),
    takeLatest(FEED.REQUEST, loadFeed),
    takeLatest(FEED.SUCCESS, setReloadTimeout),
    takeLatest(MARK.REQUEST, markPostAsRead)
  ];
}
