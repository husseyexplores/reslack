import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, withRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import store from './store'
import firebase from './firebase'

import { Spinner } from './common/components'

import App from './components/App'
import { Login, Register } from './components/Auth'

import { setUser } from './actions'

import 'semantic-ui-css/semantic.min.css'

///////////////////////////////////////////////////////////////////////

function RootContainer({ history }) {
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    firebase.auth().onAuthStateChanged(signedInUser => {
      setIsAuthReady(true)

      if (signedInUser) {
        history.push('/')
        const action = setUser(signedInUser)
        store.dispatch(action)
        const _currentUser = action.payload.currentUser
        setCurrentUser(_currentUser)
      } else {
        history.push('/login')
        setCurrentUser(null)
      }
    })
  }, [history])

  if (!isAuthReady) {
    return <Spinner dimmer text="Initializing App..." />
  }

  return (
    <Provider store={store}>
      <Switch>
        <Route
          path="/"
          exact
          render={() =>
            currentUser ? <App /> : <Spinner dimmer text="Preparing chat..." />
          }
        />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    </Provider>
  )
}

RootContainer.propTypes = {
  history: PropTypes.object.isRequired,
}

export default withRouter(RootContainer)
