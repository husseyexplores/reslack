import React, { useState, useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Loader } from 'semantic-ui-react'
import omit from 'lodash/omit'

import { useFirebaseSubscription } from '../../hooks'
import { db } from '../../firebase'

/////////////////////////////////////////////////////////////////////////////////////

const connectedRef = db.ref('.info/connected')
const presenceRef = db.ref('/presence')

const initialState = {
  users: [],
  onlineUsers: {
    total: 0,
  },
}

function reducer(state, { type, payload }) {
  switch (type) {
    case 'USER_ADDED':
      return { ...state, users: [...state.users, payload.user] }

    case 'ONLINE_USER_ADDED':
      return {
        ...state,
        onlineUsers: {
          ...state.onlineUsers,
          total: state.onlineUsers.total + 1,
          [payload.userUid]: true,
        },
      }

    case 'USER_REMOVED':
      return { ...state, users: state.users.filter(user => user.uid !== payload.userUid) }

    case 'ONLIE_USER_REMOVED':
      const newOnlineUsers = omit(state.onlineUsers, payload.userUid) // eslint-disable-line no-case-declarations
      newOnlineUsers.total--
      return { ...state, onlineUsers: newOnlineUsers }

    default:
      return state
  }
}

function DirectMessages({ currentUser }) {
  // subscribe to our channels data in firebase
  const [{ users, onlineUsers }, dispatch] = useReducer(reducer, initialState)

  const [_users, isSubscribed] = useFirebaseSubscription({
    path: `/users`,
    event: 'child_added',
    normalize: false,
    onSnapRaw: snap => {
      const user = { uid: snap.key, ...snap.val() }
      dispatch({ type: 'USER_ADDED', payload: { user } })
    },
  })

  // listen for `presence` values in database
  useEffect(() => {
    presenceRef.on('child_added', snap => {
      dispatch({ type: 'ONLINE_USER_ADDED', payload: { userUid: snap.key } })
    })

    presenceRef.on('child_removed', snap => {
      dispatch({ type: 'ONLINE_USER_REMOVED', payload: { userUid: snap.key } })
    })
  }, [currentUser.uid])

  // listen for online/offline events and set the `presence` in database
  useEffect(() => {
    connectedRef.on('value', snap => {
      if (snap.val() === true) {
        const ref = presenceRef.child(currentUser.uid)
        ref.set(true)
        ref.onDisconnect().remove()
      }
    })

    return () => connectedRef.off()
  }, [currentUser.uid])

  function isOnline(userId) {
    return Boolean(onlineUsers[userId])
  }

  // render helper
  function renderUsersList(_users) {
    if (!_users || _users.length === 0) return null

    return _users.map(_user => (
      <Menu.Item key={_user.uid} style={{ opacity: 0.7 }} onClick={() => {}}>
        <Icon name="circle" color={isOnline(_user.uid) ? 'green' : 'grey'} />
        {'@ ' + _user.displayName}
      </Menu.Item>
    ))
  }

  if (!isSubscribed) {
    return <Loader size="small" inline="centered" active />
  }

  return (
    <Menu.Menu className="menu" style={{ paddingBottom: '2em' }}>
      <Menu.Item>
        <span>
          <Icon name="mail" /> DIRECT MESSAGES
        </span>{' '}
        ({users.length}){' '}
      </Menu.Item>

      {/* Users to Send Direct Messages */}
      {renderUsersList(users)}
    </Menu.Menu>
  )
}

DirectMessages.propTypes = {
  currentUser: PropTypes.object.isRequired,
}

DirectMessages.defaultProps = {}

export default DirectMessages
