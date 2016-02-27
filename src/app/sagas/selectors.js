export const isAuthorized = (state, host) => state.auth.has(host);
export const getToken = (state, host) => state.auth.getIn([host, 'token']);
export const getUserName = (state, host) => state.auth.getIn([host, 'login']);
export const getFeed = (state, host) => state.feed.get(host);
export const getPosts = (state, host) => state.feed.getIn([host, 'result']);
