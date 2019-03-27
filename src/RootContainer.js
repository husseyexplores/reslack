import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, withRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Loader, Dimmer } from 'semantic-ui-react'
import store from './store'
import firebase from './firebase'

import App from './components/App'
import { Login, Register } from './components/Auth'

import { setUser } from './actions'

import 'semantic-ui-css/semantic.min.css'

///////////////////////////////////////////////////////////////////////

window.firebase = firebase

function RootContainer({ history }) {
  const [isAuthReady, setIsAuthReady] = useState(false)

  useEffect(() => {
    firebase.auth().onAuthStateChanged(signedInUser => {
      setIsAuthReady(true)

      if (signedInUser) {
        history.push('/')
        store.dispatch(setUser(signedInUser))
      } else {
        history.push('/login')
      }

      console.log({ signedInUser }) // eslint-disable-line
    })
  }, [history])

  if (!isAuthReady) {
    return (
      <Dimmer active inverted>
        <Loader size="large">Loading</Loader>
      </Dimmer>
    )
  }

  return (
    <Provider store={store}>
      <Switch>
        <Route path="/" exact component={App} />
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
