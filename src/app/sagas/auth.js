import { call, put, select } from 'redux-saga/effects';
import { hashHistory } from 'react-router';
import * as api from '../api';
import { showWindow } from '../services/electron';
import { popOauth } from '../utils/windows';
import { login } from '../actions/api';
import { getToken } from './selectors';

function* authorize(host, options) {
  const token = yield call(api.getToken, host, options);
  yield put(login.success({ [host]: token }));
  hashHistory.push('/feed');
  showWindow();
  return token;
}

export function* onAuth({ host }) {
  try {
    const options = yield call(popOauth, host);
    yield call(authorize, host, options);
  } catch (error) {
    yield put(login.error(error));
  }
}

export function* onLocationChange(action) {
  const pathname = action.payload.pathname;
  if (pathname !== '/login') {
    const token = yield select(getToken, 'github');
    if (!token) yield call(hashHistory.replace, '/login');
  }
}
