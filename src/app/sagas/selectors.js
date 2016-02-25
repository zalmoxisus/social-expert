export const getToken = (state, host) => state.auth[host] ? state.auth[host].token : undefined;
export const getFeed = (state, host) => state.feed[host];
