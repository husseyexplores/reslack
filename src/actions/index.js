import firebase from '../firebase'
import * as actionTypes from './types'

///////////////////////////////////////////////////////////////////////////////////

/* USER ACTIONS */

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
      currentUser: user ? _user : null,
    },
  }
}

/**
 *
 * @param {Object} creds
 * @param {string} creds.email
 * @param {string} creds.password
 * @param {Object} callback
 * @param {Function} callback.onSuccess
 * @param {Function} callback.onError
 */
export function loginUser(creds, { onSuccess = () => {}, onError = () => {} } = {}) {
  const { email, password } = creds

  return async dispatch => {
    try {
      dispatch(asyncActionStart())
      const signedInUser = await firebase
        .auth()
        .signInAndRetrieveDataWithEmailAndPassword(email, password)
      dispatch(setUser(signedInUser))
      dispatch(asyncActionFinish())
      onSuccess()
    } catch (error) {
      console.log('Error singing in.') // eslint-disable-line
      dispatch(asyncActionError(error.message))
      onError(error)
    }
  }
}

/**
 *
 * @param {Object} callback
 * @param {Function} callback.onSuccess
 * @param {Function} callback.onError
 */
export function logoutUser({ onSuccess = () => {}, onError = () => {} } = {}) {
  return async dispatch => {
    try {
      dispatch(asyncActionStart())
      const signedInUser = await firebase.auth().signOut()
      dispatch(setUser(null))
      dispatch(asyncActionFinish())
      onSuccess(signedInUser)
    } catch (error) {
      console.log('Error singing in.') // eslint-disable-line
      dispatch(asyncActionError(error.message))
      onError(error)
    }
  }
}

/* ASYNC ACTIONS LOADING STATES */

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

/* MODAL ACTIONS */

/**
 *
 * @param {string} modalType - Modal Filename
 * @param {Object} modalProps - Modal additonal props
 */
export function openModal(modalType, modalProps) {
  return {
    type: actionTypes.MODAL_OPEN,
    payload: {
      modalType,
      modalProps,
    },
  }
}

export function closeModal() {
  return {
    type: actionTypes.MODAL_CLOSE,
  }
}

/* CHANNEL ACTIONS */

/**
 *
 * @param {Object} channel
 */
export function setCurrentChannel(channel) {
  return {
    type: actionTypes.SET_CHANNEL,
    payload: {
      channel,
    },
  }
}

/**
 *
 * @param {Object} channel
 */
export function setChannels(channels) {
  return {
    type: actionTypes.SET_CHANNELS,
    payload: {
      channels,
    },
  }
}

/**
 *
 * @param {Object} channel
 */
export function updateChannel(channel) {
  return {
    type: actionTypes.UPDATE_CHANNEL,
    payload: {
      channel,
    },
  }
}

/**
 *
 * @param {Object} channel
 */
export function clearChannel(channel) {
  return {
    type: actionTypes.CLEAR_CHANNEL,
    payload: {
      channel,
    },
  }
}

export function clearAllChannels() {
  return { type: actionTypes.CLEAR_CHANNELS }
}
