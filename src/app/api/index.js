import { post, get } from './github';

export function* getToken(host, options) {
  let data;
  if (host === 'github') {
    data = yield post('https://github.com/login/oauth/access_token', options);
    return data.access_token;
  }
}

export function* fetchFeed(host, token, options) {
  let data;
  if (host === 'github') {
    data = yield get('https://api.github.com/notifications?participating=' +
      (options.participating ? 'true' : 'false'), token);
    return data;
  }
}
