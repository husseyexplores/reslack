import * as actionTypes from './types'

// USER ACTIONS

/**
 *
 * @param {Object} user - User object returned from firebase
 */
export function setUser(user) {
  const _user = {}

  if (user) {
    _user.uid = user.uid
    _user.email = user.email
    _user.avatar = user.photoURL
    _user.username = user.displayName
  }

  return {
    type: actionTypes.SET_USER,
    payload: {
      currentUser: _user,
      authenticaed: Boolean(user),
    },
  }
}

// ASYNC ACTIONS LOADING STATES
export function asyncActionStart() {
  return {
    type: actionTypes.ASYNC_START,
  }
}

export function asyncActionFinish() {
  return {
    type: actionTypes.ASYNC_FINISH,
  }
}

export function asyncActionError(error) {
  return {
    type: actionTypes.ASYNC_ERROR,
    error,
  }
}
