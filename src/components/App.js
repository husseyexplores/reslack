import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from 'semantic-ui-react'
import { connect } from 'react-redux'
import './App.css'

import ColorPanel from './ColorPanel'
import SidePanel from './SidePanel'
import Messages from './Messages'
import MetaPanel from './MetaPanel'
import ModalManager from './Modals/ModalManager'

///////////////////////////////////////////////////////////////////////////////////////

function mapState(state) {
  return {
    currentUser: state.auth.currentUser || {},
    authenticated: state.auth.authenticated,
  }
}

// Component
function App({ currentUser, dispatch }) {
  return (
    <>
      <ModalManager />

      <Grid columns="equal" className="app" style={{ background: '#eee' }}>
        <ColorPanel />
        <SidePanel currentUser={currentUser} dispatch={dispatch} />
        <Grid.Column style={{ marginLeft: 320 }}>
          <Messages />
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
}

App.defaultProps = {
  currentUser: {},
  authenticated: false,
}

export default connect(mapState)(App)
