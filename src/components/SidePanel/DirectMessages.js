import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Menu, Icon, Label } from 'semantic-ui-react'

import { setCurrentChannel } from '../../actions'
import { getChannelId } from '../../utils'

/////////////////////////////////////////////////////////////////////////////////////

// Component
function DirectMessages({
  currentUser,
  allUsersList,
  onlineUsersMap,
  setCurrentChannel,
  currentChannel,
  unseenCount,
}) {
  function isOnline(userId) {
    return Boolean(onlineUsersMap[userId])
  }

  // render helper
  function renderUsersList(users) {
    if (!users || users.length === 0) return null

    return users.map(_user => {
      const channelId = getChannelId(true, currentUser, _user)
      const eachChannelUnseenCount = unseenCount[channelId]
      return (
        <Menu.Item
          key={_user.uid}
          style={{ opacity: 0.7 }}
          onClick={() => {
            _user.uid !== currentUser.uid &&
              setCurrentChannel({
                ..._user,
                id: channelId,
                isPrivateChannel: {
                  senderUid: currentUser.uid,
                  recipientUid: _user.uid,
                },
              })
          }}
          active={currentChannel && currentChannel.uid === _user.uid}
        >
          <Label
            color="red"
            style={{ display: eachChannelUnseenCount ? 'inline-block' : 'none' }}
          >
            {Boolean(eachChannelUnseenCount) && eachChannelUnseenCount}
          </Label>
          <Icon name="circle" color={isOnline(_user.uid) ? 'green' : 'grey'} />
          {'@ ' + _user.displayName}
        </Menu.Item>
      )
    })
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
  unseenCount: PropTypes.object,
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
    unseenCount: state.unseenCount,
  }
}

const mapDispatch = { setCurrentChannel }

export default connect(
  mapState,
  mapDispatch
)(DirectMessages)
