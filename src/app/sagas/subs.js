import { call, put, select } from 'redux-saga/effects';
import { arrayOf, normalize } from 'normalizr';
import { target } from '../constants/schemas';
import * as api from '../api';
import { assignEntity } from '../api/github';
import { fetchSubs } from '../actions/api';
import { getToken } from './selectors';

export function* loadSubscriptions({ host = 'github' }) {
  try {
    const token = yield select(getToken, host);
    let data = yield call(api.fetchSubs, host, token, true);
    data = normalize([].concat(...data), arrayOf(target), { assignEntity });
    yield put(fetchSubs.success({ [host]: data }));
  } catch (error) {
    console.error(error);
    yield put(fetchSubs.error(error));
  }
}
