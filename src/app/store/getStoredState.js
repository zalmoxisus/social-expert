import { fromJS } from 'immutable';
import { getStoredState, persistStore } from 'redux-persist';

const whitelist = ['auth'];

export default function (configure, callback) {
  const persistConfig = {
    skipRestore: true,
    whitelist
  };
  getStoredState(persistConfig, (err, initialState) => {
    const initialImmutableState = {};
    whitelist.forEach(key => {
      if (initialState[key]) initialImmutableState[key] = fromJS(initialState[key]);
    });
    const store = configure(initialImmutableState);
    persistStore(store, persistConfig, () => { callback(store); });
  });
}
