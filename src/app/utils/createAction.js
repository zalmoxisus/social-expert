export const createRequestTypes = base => ({
  REQUEST: `${base}_REQUEST`,
  SUCCESS: `${base}_SUCCESS`,
  ERROR: `${base}_ERROR`
});

export const action = type => (payload = {}) => ({
  type, ...payload,
  error: payload.error
});
