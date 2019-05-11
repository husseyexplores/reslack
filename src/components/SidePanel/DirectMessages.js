import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'semantic-ui-react'

import { setCurrentChannel } from '../../actions'

/////////////////////////////////////////////////////////////////////////////////////

// Component
function DirectMessages({
  currentUser,
  allUsersList,
  onlineUsersMap,
  setCurrentChannel,
  currentChannel,
}) {
  function isOnline(userId) {
    return Boolean(onlineUsersMap[userId])
  }

  // render helper
  function renderUsersList(users) {
    if (!users || users.length === 0) return null

    return users.map(_user => (
      <Menu.Item
        key={_user.uid}
        style={{ opacity: 0.7 }}
        onClick={() => (_user.uid !== currentUser.uid ? setCurrentChannel(_user) : null)}
        active={currentChannel && currentChannel.uid === _user.uid}
      >
        <Icon name="circle" color={isOnline(_user.uid) ? 'green' : 'grey'} />
        {'@ ' + _user.displayName}
      </Menu.Item>
    ))
  }

  return (
    <Menu.Menu className="menu" style={{ paddingBottom: '2em' }}>
      <Menu.Item>
        <span>
          <Icon name="mail" /> DIRECT MESSAGES
        </span>{' '}
        ({allUsersList.length > 0 ? allUsersList.length : ' '}){' '}
      </Menu.Item>

      {/* Users to Send Direct Messages */}
      {renderUsersList(allUsersList)}
    </Menu.Menu>
  )
}

DirectMessages.propTypes = {
  currentUser: PropTypes.object.isRequired,
  allUsersList: PropTypes.array.isRequired,
  onlineUsersMap: PropTypes.object.isRequired,
  setCurrentChannel: PropTypes.func.isRequired,
  currentChannel: PropTypes.object,
}

DirectMessages.defaultProps = {
  allUsersList: [],
  onlineUsersMap: {},
}

function mapState(state) {
  return {
    currentChannel: state.channels.currentChannel,
    allUsersList: state.users.allUsersList,
    onlineUsersMap: state.users.onlineUsersMap,
    currentUser: state.auth.currentUser,
  }
}

const mapDispatch = { setCurrentChannel }

export default connect(
  mapState,
  mapDispatch
)(DirectMessages)
