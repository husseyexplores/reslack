import React from 'react'
import { Message, List, Icon } from 'semantic-ui-react'

//////////////////////////////////////////////////////////////////////////////

/**
 *
 * @param {Object} errors
 * @param {Object} touched
 */
export function renderFormikErrors(errors, touched) {
  const errorMessages = []

  for (const field in errors) {
    if (touched[field] && errors[field]) {
      errorMessages.push(errors[field])
    }
  }

  const errorOutput =
    errorMessages.length > 0 ? (
      <Message error style={{ textAlign: 'left' }}>
        <h4>Please fix the following errors:</h4>
        <List>
          {errorMessages.map((err, idx) => (
            <List.Item key={idx}>
              <Icon name="warning" />
              <List.Content>{err}</List.Content>
            </List.Item>
          ))}
        </List>
      </Message>
    ) : null

  return errorOutput
}
