const PENDING = 'PENDING';
const IN = 'IN';
const OUT = 'OUT';

export const isPending = status => status === PENDING;

export function reducer(fn, state, action) {
  switch (action.type) {
    case fn.REQUEST:
      return {
        ...state,
        status: PENDING,
        ...action.payload
      };
    case fn.SUCCESS:
      return {
        ...state,
        status: IN,
        error: undefined,
        ...action.payload
      };
    case fn.ERROR:
      return {
        ...state,
        status: OUT,
        error: action.error ? action.error.message || action.error : 'Something bad happened'
      };
    default:
      return state;
  }
}
