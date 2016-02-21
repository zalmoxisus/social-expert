import { call, put } from 'redux-saga/effects';
import { markThreadAsRead, markRepoAsRead } from '../api/github';
import { markAsRead, removeFromFeed } from '../actions/api';
import { updateTrayIcon } from '../services/electron';

export default function* onMarkAsRead(getToken, isFeedEmpty, payload) {
  try {
    const { host = 'github', id, owner, target } = payload;
    if (target) yield call(markRepoAsRead, owner, target, getToken(host));
    else yield call(markThreadAsRead, id, getToken(host));
    yield put(markAsRead.success({ host, id }));
    yield put(removeFromFeed({ host, id, owner, target }));
    if (isFeedEmpty()) updateTrayIcon(false);
  } catch (error) {
    yield put(markAsRead.error(error));
  }
}
