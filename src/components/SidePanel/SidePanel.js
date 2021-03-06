import React from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'semantic-ui-react'

import UserPanel from './UserPanel'
import Channels from './Channels'
import DirectMessages from './DirectMessages'

/////////////////////////////////////////////////////////////////////////////

function SidePanel({ currentUser, dispatch }) {
  return (
    <Menu size="large" inverted fixed="left" vertical style={{ background: '#4c3c4c' }}>
      <UserPanel currentUser={currentUser} dispatch={dispatch} />
      <Channels />
      <DirectMessages currentUser={currentUser} />
    </Menu>
  )
}

SidePanel.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
}

export default SidePanel
