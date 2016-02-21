import { getStoredState, persistStore } from 'redux-persist';

export default function (configure, callback) {
  const persistConfig = {
    skipRestore: true,
    blacklist: ['feed', 'marked']
  };
  getStoredState(persistConfig, (err, initialState) => {
    const store = configure(initialState);
    persistStore(store, persistConfig, () => { callback(store); });
  });
}
