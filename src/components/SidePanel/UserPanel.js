import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react'

import { logoutUser } from '../../actions'

/////////////////////////////////////////////////////////////////////////////

function UserPanel({ currentUser, dispatch }) {
  function handleSignOut() {
    dispatch(
      logoutUser({
        onSuccess: () => console.log('Logged out!'),
        onError: e => console.log('Error Logging out!', e.message),
      })
    )
  }

  const options = [
    {
      key: 'signedInAs',
      value: (
        <span>
          <Icon name="user" /> Signed in as <strong>{currentUser.displayName}</strong>
        </span>
      ),
      disabled: true,
    },
    { key: 'changeAvatar', value: 'Change avatar' },
    { key: 'singOut', value: 'Sign Out', onClick: handleSignOut },
  ]

  return (
    <Grid style={{ background: '#4c3c4c' }}>
      <Grid.Column>
        <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
          {/* Main Application header */}
          <Header inverted floated="left" as="h2">
            <Icon name="code" />
            <Header.Content>Reslack</Header.Content>
          </Header>
        </Grid.Row>

        {/* User action menu items */}
        <Grid.Row style={{ padding: '1.2em', margin: 0, marginTop: 10 }}>
          <Dropdown
            trigger={
              <span>
                <Image src={currentUser.photoURL} spaced="right" avatar />
                {currentUser.displayName}
              </span>
            }
            style={{ color: '#fff' }}
          >
            <Dropdown.Menu>
              {options.map(({ key, value, ...rest }) => (
                <Dropdown.Item key={key} {...rest}>
                  {value}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Grid.Row>
      </Grid.Column>
    </Grid>
  )
}

UserPanel.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
}

export default UserPanel
