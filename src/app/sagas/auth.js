import { call, put, select } from 'redux-saga/effects';
import { hashHistory } from 'react-router';
import * as api from '../api';
import { showWindow } from '../services/electron';
import { popOauth } from '../utils/windows';
import { login } from '../actions/api';
import { getToken } from './selectors';

export function* authorize({ host }) {
  try {
    const options = yield call(popOauth, host);
    const token = yield call(api.getToken, host, options);
    yield put(login.success({ [host]: token }));
    hashHistory.push('/feed');
    showWindow();
  } catch (error) {
    yield put(login.error(error));
  }
}

export function* checkAuth(action) {
  const pathname = action.payload.pathname;
  if (pathname !== '/login') {
    const token = yield select(getToken, 'github');
    if (!token) yield call(hashHistory.replace, '/login');
  }
}
