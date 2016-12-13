import fetchLinks from 'fetch-link';

export const getUrl = (val) => {
  let url = val.url
    .replace('/pulls/', '/pull/')
    .replace(/releases\/\d+./, 'releases/')
    .replace('api.github.com/repos', 'www.github.com');
  if (val.latest_comment_url) {
    url += '#issuecomment-'
      + val.latest_comment_url.substr(val.latest_comment_url.lastIndexOf('/') + 1);
  }
  return url;
};

/* eslint-disable no-param-reassign */
export const assignEntity = (obj, key, val) => {
  if (key === 'repository') obj.target = val;
  else if (key === 'subject') {
    obj.subject = val.title;
    obj.type = val.type;
    obj.url = getUrl(val);
  }
  else if (key === 'html_url') obj.url = val;
  else if (key === 'owner') {
    obj.owner = val.login;
    obj.avatar = val.avatar_url;
  }
  else if (key === 'id' || key === 'name') obj[key] = val;
};

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

export const get = (url, token, all) => {
  const options = {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: 'token ' + token,
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json'
    }
  };

  if (!all) {
    return fetch(url, options).then(response => {
      if (!response.ok) {
        return Promise.reject(`${response.statusText} url "${response.url}"`);
      }
      return response.json();
    });
  }

  return fetchLinks.all(url, { fetch: options }).then(response => {
    return Promise.all(response.map(res => res.json()));
  });
};

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
