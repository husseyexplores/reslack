import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Comment, Loader, Header, Button, Icon, Ref } from 'semantic-ui-react'

import MessageHeader from './MessageHeader'
import MessageForm from './MessageForm'
import MessageItem from './MessageItem'

///////////////////////////////////////////////////////////////////////////////////////

function noMessagesFound(handleClearQuery) {
  return (
    <Segment placeholder basic>
      <Header icon>
        <Icon name="search" />
        {`No messages found.`}
      </Header>
      <Segment.Inline>
        <Button size="small" onClick={handleClearQuery}>
          Clear Query
        </Button>
      </Segment.Inline>
    </Segment>
  )
}

function filterMessages(searchTerm, messageArr) {
  if (!searchTerm || !searchTerm.length > 0) return messageArr

  const regex = new RegExp(searchTerm, 'gi')
  return messageArr.reduce((filteredMessages, message) => {
    if (
      (message.content && message.content.match(regex)) ||
      (message.user.username && message.user.username.match(regex))
    ) {
      filteredMessages.push(message)
    }
    return filteredMessages
  }, [])
}

function getChannelName(channel) {
  return channel ? `#${channel.name}` : ''
}

function renderMessages(messages, currentUser) {
  if (!messages || messages.length === 0) return null
  return messages.map(msg => (
    <MessageItem message={msg} currentUser={currentUser} key={msg.id} />
  ))
}

// Component
function Messages({ currentChannel, currentUser, messages, dispatch }) {
  const messageContainerRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState('')

  const usersCount =
    !messages || messages.length === 0
      ? 0
      : messages.reduce(
          (uniqMsgs, msg) => {
            if (!uniqMsgs[msg.user.uid]) {
              uniqMsgs[msg.user.uid] = msg.user.uid
              uniqMsgs._totalCount++
            }
            return uniqMsgs
          },
          { _totalCount: 0 }
        )._totalCount

  /* If searchTerm is present, then filter the messages */
  const filteredMessages = filterMessages(searchTerm, messages)

  return (
    <>
      <MessageHeader
        channelName={getChannelName(currentChannel)}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        usersCount={usersCount}
      />

      <Segment>
        <Ref innerRef={messageContainerRef}>
          <Comment.Group className="messages">
            {searchTerm.length > 0 && filteredMessages.length === 0
              ? noMessagesFound(() => setSearchTerm(''))
              : renderMessages(filteredMessages, currentUser)}
          </Comment.Group>
        </Ref>
      </Segment>

      <MessageForm
        currentChannel={currentChannel}
        currentUser={currentUser}
        dispatch={dispatch}
      />
    </>
  )
}

Messages.propTypes = {
  currentChannel: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  messages: PropTypes.array.isRequired,
}

Messages.defaultProps = {
  messages: [],
  currentChannel: null,
  currentUser: null,
}

function mapState(state) {
  const currentChannel = state.channels.currentChannel
  const currentChannelId = (currentChannel && currentChannel.id) || null
  const currentChanelMessages = state.messages[currentChannelId] || []

  return {
    currentUser: state.auth.currentUser,
    messagesLoaded: state.status.messagesLoaded,
    messages: currentChanelMessages,
    currentChannel,
  }
}

export default connect(mapState)(Messages)
