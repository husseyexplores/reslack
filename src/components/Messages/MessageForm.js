import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Segment, Button, Input } from 'semantic-ui-react'

import { createTextMessage, getChannelId } from '../../utils'
import { openModal } from '../../actions'

///////////////////////////////////////////////////////////////////////////////////////

function MessageForm({
  currentChannelId,
  currentChannel,
  currentUser,
  dispatch,
  isPrivateChannel,
}) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])

  getChannelId(isPrivateChannel, currentUser, currentChannel)

  async function handleSendMessage(e) {
    e.preventDefault()

    const _message = message.trim()
    if (!_message) return
    try {
      setErrors([])
      setLoading(true)
      await createTextMessage({
        message: _message,
        channelId: currentChannelId,
        user: currentUser,
        isPrivateChannel,
      })
      setMessage('')
      setLoading(false)
    } catch (e) {
      setLoading(false)
      setErrors([...errors, e.message])
      console.log('Error sending message', e)
    }
  }

  /*
    - pm
      - user1_uid_user2_uid
        - msg1_id: {msgObject}
        - msg2_id: {msgObject}
        - msg3_id: {msgObject}
    - pms
      - user1_uid
          user1_uid_user2_uid: true
      - user2_uid
          user1_uid_user2_uid: true
  */

  return (
    <Segment className="message__form">
      <Form onSubmit={handleSendMessage}>
        <Input
          fluid
          name="message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          style={{ marginBottom: '0.7em' }}
          label={<Button icon="add" />}
          labelPosition="left"
          placeholder="Write your message..."
        />

        <Button.Group icon widths="2">
          <Button
            type="submit"
            loading={loading}
            disabled={loading || message.trim().length === 0}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            onClick={handleSendMessage}
          />
          <Button
            onClick={() =>
              dispatch(openModal('FileUploadModal', { channelId: currentChannel.id }))
            }
            type="button"
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>
      </Form>
    </Segment>
  )
}

MessageForm.propTypes = {
  currentChannelId: PropTypes.string.isRequired,
  currentChannel: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  isPrivateChannel: PropTypes.bool.isRequired,
}

export default MessageForm
