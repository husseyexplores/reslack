import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Grid, Loader, Dimmer } from 'semantic-ui-react'
import { connect } from 'react-redux'
import setupFirebaseListeners from '../firebaseListeners'
import './App.css'

import ColorPanel from './ColorPanel'
import SidePanel from './SidePanel'
import Messages from './Messages'
import MetaPanel from './MetaPanel'
import ModalManager from './Modals/ModalManager'

///////////////////////////////////////////////////////////////////////////////////////

function App({ currentUser, dispatch, messagesLoaded, authLoaded }) {
  useEffect(() => {
    return setupFirebaseListeners()
  }, [])

  if (!authLoaded) {
    return (
      <Dimmer active inverted>
        <Loader size="large">Loading settings...</Loader>
      </Dimmer>
    )
  }

  return (
    <>
      <ModalManager />

      <Grid columns="equal" className="app" style={{ background: '#eee' }}>
        <ColorPanel />
        <SidePanel currentUser={currentUser} dispatch={dispatch} />
        <Grid.Column style={{ marginLeft: 320 }}>
          {messagesLoaded ? <Messages /> : <Loader active />}
        </Grid.Column>

        <Grid.Column width={4}>
          <MetaPanel />
        </Grid.Column>
      </Grid>
    </>
  )
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  messagesLoaded: PropTypes.bool.isRequired,
  authLoaded: PropTypes.bool.isRequired,
  channelsLoaded: PropTypes.bool.isRequired,
}

App.defaultProps = {
  currentUser: {},
  authenticated: false,
  messagesLoaded: false,
  channelsLoaded: false,
}

function mapState(state) {
  return {
    currentChannel: state.channels.currentChannel,
    currentUser: state.auth.currentUser || {},
    authenticated: state.auth.authenticated,
    messagesLoaded: state.status.messagesLoaded,
    channelsList: state.channels.channelsList,
    channelsLoaded: state.status.channelsLoaded,
    authLoaded: !!state.auth.currentUser && !!state.auth.authenticated,
  }
}

export default connect(mapState)(App)
