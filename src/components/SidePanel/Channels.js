import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Menu, Icon, Loader } from 'semantic-ui-react'

import { useFirebaseSubscription } from '../../hooks'
import { openModal, setCurrentChannel, setChannels } from '../../actions'

/////////////////////////////////////////////////////////////////////////////////

function mapState(state) {
  return {
    currentChannel: state.channels.currentChannel,
  }
}

const mapDispatch = {
  setCurrentChannel,
  setChannels,
  openModal,
}

// Component
function Channels({ currentChannel, setCurrentChannel, setChannels, openModal }) {
  // subscribe to our channels data in firebase
  const [channels, isSubscribed] = useFirebaseSubscription(`/channels`)

  // Set first channel as the currentChannel on load
  useEffect(() => {
    if (isSubscribed && channels.length > 0) {
      setCurrentChannel(channels[0])
    }
  }, [isSubscribed]) // eslint-disable-line react-hooks/exhaustive-deps

  // Update channels in global state if channels changes
  useEffect(() => {
    if (channels && channels.length) {
      setChannels(channels)
    }
  }, [channels]) // eslint-disable-line react-hooks/exhaustive-deps

  function switchChannel(_channel) {
    return () => currentChannel.id !== _channel.id && setCurrentChannel(_channel)
  }

  function renderChannels(_channels) {
    if (!_channels || _channels.length === 0) return null

    return _channels.map(_channel => (
      <Menu.Item
        key={_channel.id}
        onClick={switchChannel(_channel)}
        style={{ opacity: 0.7 }}
        active={currentChannel && currentChannel.id === _channel.id}
      >
        # {_channel.name}
      </Menu.Item>
    ))
  }

  if (!isSubscribed) {
    return <Loader size="small" inline="centered" active />
  }

  return (
    <Menu.Menu style={{ paddingBottom: '2em' }}>
      <Menu.Item>
        <span>
          <Icon name="exchange" /> CHANNELS
        </span>{' '}
        ({channels.length}){' '}
        <Icon link name="add" onClick={() => openModal('ChannelFormModal')} />
      </Menu.Item>

      {/* Channels */}
      {renderChannels(channels)}
    </Menu.Menu>
  )
}

Channels.propTypes = {
  setCurrentChannel: PropTypes.func.isRequired,
  setChannels: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  currentChannel: PropTypes.object,
}

Channels.defaultProps = {
  setCurrentChannel: () => {},
  setChannels: () => {},
  openModal: () => {},
  currentChannel: null,
}

export default connect(
  mapState,
  mapDispatch
)(Channels)
