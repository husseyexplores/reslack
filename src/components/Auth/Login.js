import React from 'react'
// import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import firebase from '../../firebase'
import { Formik } from 'formik'
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'

import { isValidEmail, renderFormikErrors } from '../../utils/'

////////////////////////////////////////////////////////////////////////////////////////

function Login() {
  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h1" icon color="violet" textAlign="center">
          <Icon name="code branch" color="violet" />
          Login to Reslack
        </Header>

        <Formik
          initialValues={initialValues}
          validate={validateForm}
          onSubmit={handleFormSubmit}
          validateOnBlur={false}
        >
          {({
            values,
            errors,
            dirty,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => {
            return (
              <Form size="large" onSubmit={handleSubmit} error>
                <Segment>
                  <Form.Input
                    autoFocus
                    fluid
                    name="email"
                    value={values.email}
                    icon="mail"
                    iconPosition="left"
                    placeholder="Email Address"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="email"
                    error={errors.email && touched.email}
                  />

                  <Form.Input
                    fluid
                    name="password"
                    value={values.password}
                    icon="lock"
                    iconPosition="left"
                    placeholder="Password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="password"
                    error={errors.password && touched.password}
                  />

                  <Button
                    disabled={isSubmitting || !dirty || Object.keys(errors).length > 0}
                    loading={isSubmitting}
                    color="violet"
                    fluid
                    size="large"
                  >
                    Submit
                  </Button>
                </Segment>

                {renderFormikErrors(errors, touched)}
              </Form>
            )
          }}
        </Formik>

        <Message>
          Not a user? <Link to="/register">Register now!</Link>
        </Message>
      </Grid.Column>
    </Grid>
  )
}

const initialValues = {
  email: '',
  password: '',
}

function validateForm(values) {
  const errors = {}

  if (!isValidEmail(values.email)) {
    errors.email = 'Invalid email address'
  }

  if (values.password.length < 6) {
    errors.password = 'Password should contain at least 6 characters'
  }

  return errors
}

// Submit form handler
async function handleFormSubmit(
  { email, password },
  { setSubmitting, setErrors, setTouched }
) {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password)

    setSubmitting(false)
  } catch (err) {
    setSubmitting(false)

    // Get the errored field name from the error message
    let errorFieldName = err.message.match(/email|password/gi)
    if (errorFieldName && errorFieldName.length) {
      errorFieldName = errorFieldName[0]
      // focus the errored field
      const element = document.querySelector(`input[name="${errorFieldName}"]`)
      element && element.focus()
    } else {
      errorFieldName = 'serverError'
    }

    // Set the formik error messages
    setTouched({ [errorFieldName]: true })
    setErrors({ [errorFieldName]: err.message })
    console.log('Error submitting the Login Form.') // eslint-disable-line no-console
    console.log(err) // eslint-disable-line no-console
  }
}

export default Login
