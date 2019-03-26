import React from 'react'
// import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import firebase from '../../firebase'
import { Formik } from 'formik'
import md5 from 'md5'
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
  List,
} from 'semantic-ui-react'

import { saveUserToDB, isValidEmail } from '../../utils/'

///////////////////////////////////////////////////////////////////////////////

function renderErrors(errors, touched) {
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

const initialValues = {
  username: '',
  email: '',
  password: '',
  passwordConfirmation: '',
}

function validateForm(values) {
  const errors = {}

  if (!values.username) {
    errors.username = 'Required'
  }

  if (values.username.length < 3) {
    errors.username = 'Username should contain at least 3 characters'
  }

  if (!isValidEmail(values.email)) {
    errors.email = 'Invalid email address'
  }

  if (values.password.length < 6) {
    errors.password = 'Password should contain at least 6 characters'
  }

  if (values.passwordConfirmation !== values.password) {
    errors.passwordConfirmation = 'Passwords mismatched'
  }

  return errors
}

async function handleFormSubmit(
  { email, password, username },
  { setSubmitting, setErrors, setTouched }
) {
  try {
    const createdUser = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)

    await createdUser.user.updateProfile({
      displayName: username,
      photoURL: `http://gravatar.com/avatar/${md5(email)}?d=identicon`,
    })

    await saveUserToDB(createdUser)

    console.log(createdUser)
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
    console.log('Error submitting the Register Form.') // eslint-disable-line no-console
    console.log(err) // eslint-disable-line no-console
  }
}

function Register() {
  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h1" icon color="orange" textAlign="center">
          <Icon name="puzzle piece" color="orange" />
          Register for Reslack
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
                    name="username"
                    value={values.username}
                    icon="user"
                    iconPosition="left"
                    placeholder="Username"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    error={errors.username && touched.username}
                  />

                  <Form.Input
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

                  <Form.Input
                    fluid
                    value={values.passwordConfirmation}
                    name="passwordConfirmation"
                    icon="repeat"
                    iconPosition="left"
                    placeholder="Password Confirmation"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="password"
                    error={
                      errors.passwordConfirmation &&
                      touched.passwordConfirmation
                    }
                  />

                  <Button
                    disabled={
                      isSubmitting || !dirty || Object.keys(errors).length > 0
                    }
                    loading={isSubmitting}
                    color="orange"
                    fluid
                    size="large"
                  >
                    Submit
                  </Button>
                </Segment>

                {renderErrors(errors, touched)}
              </Form>
            )
          }}
        </Formik>

        <Message>
          Already a user? <Link to="/login">Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  )
}

Register.propTypes = {}

Register.defaultProps = {}

export default Register
