import React from 'react'
import PropTypes from 'prop-types'
import { Comment, Image } from 'semantic-ui-react'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

///////////////////////////////////////////////////////////////////////////////////////

function timeFromNow(date) {
  return distanceInWordsToNow(date) + ' ago'
}

function isImage(message) {
  return message.hasOwnProperty('imageURL') && !message.hasOwnProperty('content')
}

// Component
function MessageItem({ message, currentUser }) {
  const { user: createdBy } = message
  function isOwnUser() {
    return createdBy.uid === currentUser.uid
  }

  return (
    <Comment>
      <Comment.Avatar src={createdBy.avatar} />
      <Comment.Content className={isOwnUser() ? 'message__self' : ''}>
        <Comment.Author as="a">{createdBy.username}</Comment.Author>
        <Comment.Metadata>{timeFromNow(message.createdAt)}</Comment.Metadata>

        {isImage(message) ? (
          <Image src={message.imageURL} className="message__image" />
        ) : (
          <Comment.Text>{message.content}</Comment.Text>
        )}
      </Comment.Content>
    </Comment>
  )
}

MessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
}

export default MessageItem
