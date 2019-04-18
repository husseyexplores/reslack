import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Segment, Icon } from 'semantic-ui-react'
import { withFormik } from 'formik'

import { createNewChannel, renderFormikErrors } from '../../utils'

///////////////////////////////////////////////////////////////////////////////////////

function ChannelForm({
  values,
  errors,
  dirty,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) {
  return (
    <Form error onSubmit={handleSubmit}>
      <Form.Field
        control={Input}
        id="channel-form-channel-name"
        label="Channel Name"
        placeholder="Channel Name"
        name="channelName"
        value={values.channelName}
        fluid
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.channelName && touched.channelName}
      />

      <Form.Field
        control={Input}
        id="channel-form-channel-description"
        label="Channel Description"
        placeholder="Channel Description"
        name="channelDescription"
        value={values.channelDescription}
        fluid
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.description && touched.description}
      />

      {renderFormikErrors(errors, touched)}
      <Segment textAlign="center" basic>
        <Button
          disabled={isSubmitting || !dirty || Object.keys(errors).length > 0}
          loading={isSubmitting}
          color="green"
          type="submit"
          labelPosition="left"
          icon
        >
          <Icon name="checkmark" />
          Create Channel
        </Button>
      </Segment>
    </Form>
  )
}

ChannelForm.propTypes = {
  values: PropTypes.object,
  errors: PropTypes.object,
  touched: PropTypes.object,
  dirty: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
}

export default withFormik({
  mapPropsToValues: () => ({ channelName: '', channelDescription: '' }),

  // Custom sync validation
  validate: values => {
    const errors = {}

    if (!values.channelName) {
      errors.channelName = 'Required'
    }

    if (values.channelName.length < 3) {
      errors.channelName = 'Channel Name should contain at least 3 characters'
    }

    return errors
  },

  handleSubmit: async (
    { channelName, channelDescription },
    { setSubmitting, setTouched, setErrors, props: { closeModal } }
  ) => {
    try {
      const createdChannel = await createNewChannel(
        channelName.trim(),
        channelDescription.trim()
      )

      console.log(createdChannel) // eslint-disable-line no-console

      closeModal()
      setSubmitting(false)
    } catch (err) {
      setSubmitting(false)
      // Set the formik error messages
      setTouched({ serverError: true })
      setErrors({ serverError: err.message })
      console.log('Error creating new channel') // eslint-disable-line no-console
      console.log(err) // eslint-disable-line no-console
    }
  },

  displayName: 'ChannelForm',
})(ChannelForm)
