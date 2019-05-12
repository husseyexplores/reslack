import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Comment, Header, Button, Icon, Ref } from 'semantic-ui-react'
import isSameDay from 'date-fns/is_same_day'

import { getChannelId } from '../../utils'
import MessageHeader from './MessageHeader'
import MessageForm from './MessageForm'
import MessageItem from './MessageItem'
import ChatScroller from './ChatScroller'

///////////////////////////////////////////////////////////////////////////////////////

function Messages({
  currentChannelId,
  currentChannel,
  currentUser,
  messages,
  dispatch,
  allUsersMap,
  isPrivateChannel,
}) {
  const messageContainerRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState('')

  const usersCount =
    !messages || messages.length === 0
      ? 0
      : messages.reduce(
          (uniqMsgs, msg) => {
            if (!uniqMsgs[msg.senderId]) {
              uniqMsgs[msg.senderId] = msg.senderId
              uniqMsgs._totalCount++
            }
            return uniqMsgs
          },
          { _totalCount: 0 }
        )._totalCount

  /* If searchTerm is present, then filter the messages */
  const filteredMessages = filterMessages(searchTerm, messages)

  if (!currentChannel) {
    return null
  }

  return (
    <>
      <MessageHeader
        channelName={getChannelName(currentChannel, isPrivateChannel)}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        usersCount={usersCount}
        isPrivateChannel={isPrivateChannel}
      />

      <Segment>
        <Ref innerRef={messageContainerRef}>
          <Comment.Group className="messages">
            <ChatScroller scrollerRef={messageContainerRef} />
            {searchTerm.length > 0 && filteredMessages.length === 0
              ? noMessagesFound(() => setSearchTerm(''))
              : filteredMessages.length === 0
              ? noMessagesYet()
              : renderMessages(filteredMessages, currentUser, allUsersMap)}
          </Comment.Group>
        </Ref>
      </Segment>

      <MessageForm
        currentChannelId={currentChannelId}
        isPrivateChannel={isPrivateChannel}
        currentChannel={currentChannel}
        currentUser={currentUser}
        dispatch={dispatch}
      />
    </>
  )
}

Messages.propTypes = {
  currentChannelId: PropTypes.string.isRequired,
  currentChannel: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  messages: PropTypes.array.isRequired,
  allUsersMap: PropTypes.object.isRequired,
  isPrivateChannel: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      senderUid: PropTypes.string.isRequired,
      recipientUid: PropTypes.string.isRequired,
    }),
  ]).isRequired,
}

Messages.defaultProps = {
  messages: [],
  currentChannel: null,
  currentUser: null,
}

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

function noMessagesYet() {
  return (
    <Segment placeholder basic textAlign="center">
      <Header>{`No messages found.`}</Header>
    </Segment>
  )
}

function filterMessages(searchTerm, messageArr) {
  if (!searchTerm || !searchTerm.length > 0) return messageArr

  const regex = new RegExp(searchTerm, 'gi')
  return messageArr.reduce((filteredMessages, message) => {
    if (
      (message.content && message.content.match(regex)) ||
      (message.user.displayName && message.user.displayName.match(regex))
    ) {
      filteredMessages.push(message)
    }
    return filteredMessages
  }, [])
}

function getChannelName(channel, isPrivateChannel) {
  return isPrivateChannel ? `#${channel.displayName}` : `#${channel.name}`
}

function renderMessages(messages, currentUser, allUsersMap) {
  if (!messages || messages.length === 0) return null
  return messages.map((msg, idx) => {
    const prevMsg = messages[idx - 1]
    const showDay = shouldShowDay(prevMsg, msg)
    const showAvatar = shouldShowAvatar(prevMsg, msg)

    return (
      <MessageItem
        key={msg.id}
        message={msg}
        sender={allUsersMap[msg.senderId]}
        currentUser={currentUser}
        showDay={showDay}
        showAvatar={showAvatar}
      />
    )
  })
}

function shouldShowDay(prevMsg, msg) {
  const isFirstMsg = !prevMsg
  if (isFirstMsg) return true

  const isNewDay = !isSameDay(prevMsg.createdAt, msg.createdAt)
  return isNewDay
}

function shouldShowAvatar(prevMsg, msg) {
  const isFirstMsg = !prevMsg
  if (isFirstMsg) return true

  const isDifferentUser = prevMsg.senderId !== msg.senderId
  if (isDifferentUser) return true

  const hasBeenAWhile = msg.createdAt - prevMsg.createdAt > 180 * 1000 // more than 3 minutes
  return hasBeenAWhile
}

function mapState(state) {
  const currentChannel = state.channels.currentChannel
  // uid will only exist if the channel is private
  const isPrivateChannel = !currentChannel.uid
    ? false
    : {
        senderUid: state.auth.currentUser.uid,
        recipientUid: currentChannel.uid,
      }

  const currentChannelId = getChannelId(
    isPrivateChannel,
    state.auth.currentUser,
    currentChannel
  )

  const currentChanelMessages = state.messages[currentChannelId]

  return {
    currentUser: state.auth.currentUser,
    messagesLoaded: state.status.messagesLoaded,
    messages: currentChanelMessages,
    currentChannel,
    allUsersMap: state.users.allUsersMap,
    currentChannelId,
    isPrivateChannel,
  }
}

export default connect(mapState)(Messages)
