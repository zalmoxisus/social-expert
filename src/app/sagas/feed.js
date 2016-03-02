import { call, put, select } from 'redux-saga/effects';
import { arrayOf, normalize } from 'normalizr';
import { post } from '../constants/schemas';
import * as api from '../api';
import { assignEntity } from '../api/github';
import { fetchFeed } from '../actions/api';
import { groupByTarget } from '../utils/feedUtils';
import { updateTrayIcon } from '../services/electron';
import notify from '../utils/notifications';
import { getToken, getPosts } from './selectors';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export function* setReloadTimeout() {
  yield delay(60000);
  yield put(fetchFeed.request());
}

export function* loadFeed({ host = 'github', participating }) {
  try {
    const token = yield select(getToken, host);
    let feed = yield call(api.fetchFeed, host, token, { participating });
    feed = normalize(feed, arrayOf(post), { assignEntity });
    const result = feed.result;
    const count = result.length;
    updateTrayIcon(count);
    const posts = yield select(getPosts, host);
    const firstDiff = !posts || result[0] !== posts.first();
    if (posts && firstDiff) notify(feed);

    if (firstDiff || result[count - 1] !== posts.last()) {
      yield put(fetchFeed.success({ host, payload: groupByTarget(feed) }));
    } else yield put(fetchFeed.success());
  } catch (error) {
    console.error(error);
    yield put(fetchFeed.error(error));
  }
}
