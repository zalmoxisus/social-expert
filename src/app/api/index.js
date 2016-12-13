import { post, get } from './github';

export function* getToken(host, options) {
  let data;
  if (host === 'github') {
    data = yield post('https://github.com/login/oauth/access_token', options);
    return data.access_token;
  }
}

export function* fetchUser(host, token) {
  let data;
  if (host === 'github') {
    data = yield get('https://api.github.com/user', token);
    return data;
  }
}

export function* fetchFeed(host, token, options) {
  let data;
  let url;
  if (host === 'github') {
    url = 'https://api.github.com/notifications?participating=' +
      (options.participating ? 'true' : 'false');
    if (options.since) url += '&since=' + options.since;
    else if (options.before) url += '&before=' + options.before;
    data = yield get(url, token);
    return data;
  }
}

export function* fetchSubs(host, token) {
  let data;
  if (host === 'github') {
    data = yield get('https://api.github.com/user/subscriptions?per_page=100', token, true);
    return data;
  }
}
