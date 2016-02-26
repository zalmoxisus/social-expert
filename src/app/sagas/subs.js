import { call, put, select } from 'redux-saga/effects';
import { arrayOf, normalize } from 'normalizr';
import { fromJS } from 'immutable';
import { target } from '../constants/schemas';
import * as api from '../api';
import { assignEntity } from '../api/github';
import { fetchSubs } from '../actions/api';
import { getToken, getUserName } from './selectors';

export function* loadSubscriptions({ host = 'github' }) {
  try {
    const token = yield select(getToken, host);
    let data = yield call(api.fetchSubs, host, token, true);
    const login = yield select(getUserName, host);
    let groups = [[], [], []];
    data = normalize([].concat(...data), arrayOf(target), {
      assignEntity: assignEntity(groups, login)
    });
    yield put(fetchSubs.success({
      host,
      payload: fromJS({ targets: data.entities.targets, groups })
    }));
  } catch (error) {
    console.error(error);
    yield put(fetchSubs.error(error));
  }
}
