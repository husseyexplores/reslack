import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import firebase from '../firebase'

import rootReducer from '../reducers'
import resetUnseenMsgCount from './middlewares/resetUnseenMsgCount'

/////////////////////////////////////////////////////////////////////////////////

const configureStore = preloadedState => {
  const middlewares = [thunk.withExtraArgument({ firebase }), resetUnseenMsgCount]
  const middlewareEnahcer = applyMiddleware(...middlewares)

  // const storeEnhancers = [middlewareEnahcer, reduxDevToolsInitializer]
  const storeEnhancers = [middlewareEnahcer]

  const composedEnhancers = composeWithDevTools(...storeEnhancers)

  const store = createStore(rootReducer, preloadedState, composedEnhancers)

  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('../reducers', () => {
        const newRootReducer = require('../reducers/').default
        store.replaceReducer(newRootReducer)
      })
    }
  }
  return store
}

export default configureStore
