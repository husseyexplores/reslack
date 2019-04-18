import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Segment, Button, Input } from 'semantic-ui-react'

import { createTextMessage } from '../../utils'
import { openModal } from '../../actions'

///////////////////////////////////////////////////////////////////////////////////////

// Component
function MessageForm({ currentChannel, currentUser, dispatch }) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])

  async function handleSendMessage(e) {
    e.preventDefault()

    const _message = message.trim()
    if (!_message) return
    try {
      setErrors([])
      setLoading(true)
      await createTextMessage(_message, currentChannel.id, currentUser)
      setMessage('')
      setLoading(false)
    } catch (e) {
      setLoading(false)
      setErrors([...errors, e.message])
      console.log('Error sending message', e) // eslint-disable-line no-console
    }
  }

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
  currentChannel: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default MessageForm
