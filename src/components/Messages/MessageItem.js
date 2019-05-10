import React from 'react'
import PropTypes from 'prop-types'
import { Comment, Image } from 'semantic-ui-react'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

///////////////////////////////////////////////////////////////////////////////////////

function MessageItem({ message, currentUser, sender, showDay, showAvatar }) {
  const isOwnMsg = sender.uid === currentUser.uid

  return (
    <Comment className={!showAvatar ? 'adjacent-msg' : ''}>
      <Comment.Avatar src={showAvatar ? sender.avatar : null} />
      <Comment.Content className={isOwnMsg ? 'message__self' : ''}>
        {showAvatar && <Comment.Author as="a">{sender.displayName}</Comment.Author>}
        {showAvatar && (
          <Comment.Metadata>{timeFromNow(message.createdAt)}</Comment.Metadata>
        )}

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
  sender: PropTypes.object.isRequired,
  showDay: PropTypes.bool.isRequired,
  showAvatar: PropTypes.bool.isRequired,
}

function timeFromNow(date) {
  return distanceInWordsToNow(date) + ' ago'
}

function isImage(message) {
  return message.hasOwnProperty('imageURL')
}

export default MessageItem
