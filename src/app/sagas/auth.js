import { Map } from 'immutable';
import { call, put, select } from 'redux-saga/effects';
import { hashHistory } from 'react-router';
import * as api from '../api';
import { showWindow } from '../services/electron';
import { popOauth } from '../utils/windows';
import { login } from '../actions/api';
import { getToken, isAuthorized } from './selectors';

export function* authorize({ host }) {
  try {
    const options = yield call(popOauth, host);
    const token = yield call(api.getToken, host, options);
    const user = yield call(api.fetchUser, host, token);
    yield put(login.success({
      host,
      payload: new Map({ token, id: user.id, login: user.login })
    }));
    hashHistory.push('/feed');
    showWindow();
  } catch (error) {
    yield put(login.error(error));
  }
}

export function* checkAuth(action) {
  const pathname = action.payload.pathname;
  if (pathname !== '/login') {
    const isAuth = yield select(isAuthorized, 'github');
    if (!isAuth) yield call(hashHistory.replace, '/login');
  }
}
