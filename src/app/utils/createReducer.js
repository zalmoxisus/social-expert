export const PENDING = 'PENDING';
export const IN = 'IN';
export const OUT = 'OUT';

export const isPending = status => status === PENDING;

function getStatus(fn, type) {
  switch (type) {
    case fn.REQUEST:
      return PENDING;
    case fn.SUCCESS:
      return IN;
    case fn.ERROR:
      return OUT;
    default:
      return undefined;
  }
}

function processError(error) {
  return error ? error.message || error : 'Something bad happened';
}

export function reducer(fn, state, action) {
  if (
    action.type !== fn.REQUEST &&
    action.type !== fn.SUCCESS &&
    action.type !== fn.ERROR
  ) return state;

  return state.withMutations(map => {
    map.set('status', getStatus(fn, action.type));
    map.set('error', action.type === fn.ERROR ? processError(action.error) : undefined);
    if (action.payload) {
      if (action.host) map.set(action.host, action.payload);
      else map.merge(action.payload);
    }
  });
}
