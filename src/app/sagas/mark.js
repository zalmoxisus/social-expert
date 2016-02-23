import { call, put, select } from 'redux-saga/effects';
import { markThreadAsRead, markRepoAsRead } from '../api/github';
import { markAsRead, removeFromFeed } from '../actions/api';
import { getToken, getFeed } from './selectors';
import { updateTrayIcon } from '../services/electron';

function* isFeedEmpty(host) {
  const feed = yield select(getFeed, host);
  return !feed || feed.result.length === 0;
}

export default function* onMarkAsRead(payload) {
  try {
    const { host = 'github', id, owner, target } = payload;
    const token = yield select(getToken, host);
    if (target) yield call(markRepoAsRead, owner, target, token);
    else yield call(markThreadAsRead, id, token);
    yield put(markAsRead.success({ host, id }));
    yield put(removeFromFeed({ host, id, owner, target }));
    if (yield isFeedEmpty(host)) updateTrayIcon(false);
  } catch (error) {
    yield put(markAsRead.error(error));
  }
}
