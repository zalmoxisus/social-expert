import { call, put, select } from 'redux-saga/effects';
import { arrayOf, normalize } from 'normalizr';
import { fromJS } from 'immutable';
import { post } from '../constants/schemas';
import * as api from '../api';
import { assignEntity } from '../api/github';
import { fetchFeed } from '../actions/api';
import { updateTrayIcon } from '../services/electron';
import notify from '../utils/notifications';
import { getToken, getFeed } from './selectors';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export function* setReloadTimeout() {
  yield delay(60000);
  yield put(fetchFeed.request());
}

function* areNewPosts(feed, host) {
  const current = yield select(getFeed, host);
  return current && feed.result[0] !== current.getIn(['result', 0]);
}

export function* loadFeed({ host = 'github', participating }) {
  try {
    const token = yield select(getToken, host);
    let feed = yield call(api.fetchFeed, host, token, { participating });
    feed = normalize(feed, arrayOf(post), { assignEntity: assignEntity() });
    updateTrayIcon(feed.result.length);
    if (yield areNewPosts(feed, host)) notify(feed);
    yield put(fetchFeed.success({ host, payload: fromJS(feed) }));
  } catch (error) {
    console.error(error);
    yield put(fetchFeed.error(error));
  }
}
