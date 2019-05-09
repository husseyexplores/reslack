import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Menu, Icon, Loader } from 'semantic-ui-react'

import { openModal, setCurrentChannel } from '../../actions'

/////////////////////////////////////////////////////////////////////////////////

function Channels({
  currentChannel,
  setCurrentChannel,
  channelsList,
  openModal,
  channelsLoaded,
}) {
  function switchChannel(_channel) {
    return () => currentChannel.id !== _channel.id && setCurrentChannel(_channel)
  }

  function renderChannels(channels) {
    if (!channels || channels.length === 0) return null

    return channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={switchChannel(channel)}
        style={{ opacity: 0.7 }}
        active={currentChannel && currentChannel.id === channel.id}
      >
        # {channel.name}
      </Menu.Item>
    ))
  }

  if (!channelsLoaded) {
    return <Loader size="small" inline="centered" active />
  }

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="exchange" /> CHANNELS
        </span>{' '}
        ({channelsList.length}){' '}
        <Icon link name="add" onClick={() => openModal('ChannelFormModal')} />
      </Menu.Item>

      {/* Channels */}
      {renderChannels(channelsList)}
    </Menu.Menu>
  )
}

Channels.propTypes = {
  setCurrentChannel: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  currentChannel: PropTypes.object,
  channelsList: PropTypes.array.isRequired,
  channelsLoaded: PropTypes.bool.isRequired,
}

Channels.defaultProps = {
  setCurrentChannel: () => {},
  openModal: () => {},
  currentChannel: null,
  channelsList: [],
  channelsLoaded: true,
}

function mapState(state) {
  return {
    currentChannel: state.channels.currentChannel,
    channelsList: state.channels.channelsList,
    channelsLoaded: state.status.channelsLoaded,
  }
}

const mapDispatch = {
  setCurrentChannel,
  openModal,
}

export default connect(
  mapState,
  mapDispatch
)(Channels)
