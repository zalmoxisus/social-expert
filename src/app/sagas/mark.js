import { call, put, select } from 'redux-saga/effects';
import { markThreadAsRead, markRepoAsRead } from '../api/github';
import { markAsRead, removeFromFeed } from '../actions/api';
import { getToken, getFeed } from './selectors';
import { updateTrayIcon } from '../services/electron';

function* isFeedEmpty(host) {
  const feed = yield select(getFeed, host);
  return !feed || feed.get('result').size === 0;
}

export default function* markPostAsRead(payload) {
  try {
    const { host = 'github', id, targetId, targetName, owner } = payload;
    const token = yield select(getToken, host);
    if (targetName) yield call(markRepoAsRead, owner, targetName, token);
    else yield call(markThreadAsRead, id, token);
    yield put(markAsRead.success({ host, id }));
    yield put(removeFromFeed({ host, id, targetId, targetName }));
    if (yield isFeedEmpty(host)) updateTrayIcon(false);
  } catch (error) {
    yield put(markAsRead.error(error));
  }
}
