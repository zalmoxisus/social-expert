import { createStore, applyMiddleware, compose } from 'redux';
import saga from 'redux-saga';
import rootReducer from '../reducers';
import rootSaga from '../sagas';
import getState from './getStoredState';

export default function configureStore(callback) {
  getState(initialState => {
    let enhancer;
    const middleware = [
      saga(rootSaga)
    ];

    if (process.env.NODE_ENV !== 'production') {
      middleware.push(
        require('redux-immutable-state-invariant')(),
        require('redux-logger')({ level: 'info', collapsed: true })
      );
      enhancer = compose(
        applyMiddleware(...middleware),
        require('remote-redux-devtools')()
      );
    } else {
      enhancer = applyMiddleware(...middleware);
    }

    const store = createStore(rootReducer, initialState, enhancer);

    if (process.env.NODE_ENV !== 'production') {
      if (module.hot) {
        module.hot.accept('../reducers', () =>
          store.replaceReducer(require('../reducers'))
        );
      }
    }

    return store;
  }, callback);
}
