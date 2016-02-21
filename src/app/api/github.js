/* eslint-disable no-param-reassign */
export const assignEntity = (obj, key, val) => {
  if (key === 'repository') obj.target = val;
  else if (key === 'subject') {
    obj.subject = val.title;
    obj.type = val.type;
    obj.url = val.url
        .replace('/pulls/', '/pull/')
        .replace('api.github.com/repos', 'www.github.com')
      + '#issuecomment-'
      + val.latest_comment_url.substr(val.latest_comment_url.lastIndexOf('/') + 1);
  }
  else if (key === 'html_url') obj.url = val;
  else if (key === 'owner') {
    obj.owner = val.login;
    obj.avatar = val.avatar_url;
  }
  else if (key === 'id' || key === 'name') obj[key] = val;
};
/* eslint-enable no-alert */

export const post = (url, options) => (
  fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(options)
  }).then(response => {
    if (!response.ok) {
      return Promise.reject(`${response.statusText} url "${response.url}"`);
    }
    return response.json();
  })
);

export const get = (url, token) => (
  fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: 'token ' + token,
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (!response.ok) {
      return Promise.reject(`${response.statusText} url "${response.url}"`);
    }
    return response.json();
  })
);

export const markThreadAsRead = (id, token) => (
  fetch('https://api.github.com/notifications/threads/' + id, {
    method: 'PATCH',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: 'token ' + token,
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (!response.ok) {
      return Promise.reject(`${response.statusText} url "${response.url}"`);
    }
    return Promise.resolve();
  })
);

export const markRepoAsRead = (id, repo, token) => (
  fetch(`https://api.github.com/repos/${id}/${repo}/notifications`, {
    body: JSON.stringify({}),
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: 'token ' + token,
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (!response.ok) {
      return Promise.reject(`${response.statusText} url "${response.url}"`);
    }
    return Promise.resolve();
  })
);
