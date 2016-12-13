import { call, put, select } from 'redux-saga/effects';
import { arrayOf, normalize } from 'normalizr';
import { post } from '../constants/schemas';
import * as api from '../api';
import { assignEntity } from '../api/github';
import { fetchFeed } from '../actions/api';
import { getUrl } from '../api/github';
import { groupByTarget } from '../utils/feedUtils';
import { updateTrayIcon, showNotification } from '../services/electron';
import { getToken, getTargets } from './selectors';

let lastUpdated;
let lastNotified;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export function* setReloadTimeout() {
  yield delay(60000);
  yield put(fetchFeed.request());
}

export function* loadFeed({ host = 'github', participating }) {
  try {
    const token = yield select(getToken, host);
    let feed = yield call(api.fetchFeed, host, token, { participating });
    if (!feed.length || lastUpdated && feed[0].updated_at < lastUpdated) {
      yield put(fetchFeed.success());
      return;
    }
    lastUpdated = feed[0].updated_at;

    const targets = yield select(getTargets, host);
    let item;
    for (let i = 0; i < feed.length; i++) {
      item = feed[i];
      if (!item) continue;
      if (targets.getIn([item.repository.id.toString(), 'priority']) === 0) {
        if (lastNotified && lastNotified < item.updated_at) {
          showNotification(
            item.repository.owner.login + '/' + item.repository.name,
            item.subject.title, item.repository.owner.avatar_url, getUrl(item.subject)
          );
        }
        lastNotified = item.updated_at;
        break;
      }
    }

    feed = normalize(feed, arrayOf(post), { assignEntity });
    const result = feed.result;
    const count = result.length;
    updateTrayIcon(count);

    yield put(fetchFeed.success({ host, payload: groupByTarget(feed) }));
  } catch (error) {
    console.error(error);
    yield put(fetchFeed.error(error));
  }
}
