import firebase, { db } from '../firebase'
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
    _user.photoURL = user.photoURL
    _user.displayName = user.displayName
  }
  const action = {
    type: actionTypes.SET_USER,
    payload: {
      currentUser: user ? _user : null,
    },
  }
  return action
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
      const signedInUserId = firebase.auth().getUid()
      await firebase.auth().signOut()
      dispatch(setUser(null))
      dispatch(asyncActionFinish())
      onSuccess(signedInUserId)
      await firebase
        .database()
        .ref('/presence')
        .child(signedInUserId)
        .set({
          state: 'offline',
          lastChanged: firebase.database.ServerValue.TIMESTAMP,
        })
    } catch (error) {
      console.log('Error singing in.') // eslint-disable-line
      dispatch(asyncActionError(error.message))
      onError(error)
    }
  }
}

/* ALL USERS ACTIONS */

export function addOnlineUser(user) {
  let userId
  if (typeof user === 'object' && user.id) {
    userId = user.id
  } else if (typeof user === 'string') {
    userId = user
  } else {
    throw new Error('Please provide a valid userId in `addOnlineUser` action creator')
  }

  return {
    type: actionTypes.USER_ONLINE,
    payload: { userId },
  }
}

export function removeOnlineUser(user) {
  let userId
  if (typeof user === 'object' && user.id) {
    userId = user.id
  } else if (typeof user === 'string') {
    userId = user
  } else {
    throw new Error('Please provide a valid userId in `addOnlineUser` action creator')
  }

  return {
    type: actionTypes.USER_OFFLINE,
    payload: { userId },
  }
}

export function addAvailableUser(user) {
  if (!user) throw new Error('Please provide a user')
  return {
    type: actionTypes.ADD_USER,
    payload: { user },
  }
}

export function updateAvailableUser(user) {
  if (!user) throw new Error('Please provide a user')
  return {
    type: actionTypes.UPDATE_USER,
    payload: { user },
  }
}

export function removeAvailableUser(user) {
  if (!user) throw new Error('Please provide a user')
  return {
    type: actionTypes.REMOVE_USER,
    payload: { user },
  }
}

export function resetAllUsers() {
  return { type: actionTypes.RESET_USERS }
}

/* ASYNC ACTIONS LOADING STATES */

export function asyncActionStart(flag) {
  const action = {
    type: actionTypes.ASYNC_START,
  }

  if (flag) {
    action.payload = { [action[flag]]: true }
  }

  return action
}

export function asyncActionFinish(flag) {
  const action = {
    type: actionTypes.ASYNC_FINISH,
  }

  if (flag) {
    action.payload = { [action[flag]]: false }
  }

  return action
}

export function asyncActionError(error) {
  return {
    type: actionTypes.ASYNC_ERROR,
    error,
  }
}

export function setLoadingFlag(key, status) {
  if (!key === undefined || !status === undefined)
    throw new Error('Missing arguments in `setLoadingFlag` action')

  return {
    type: actionTypes.ASYNC_SET_FLAG,
    payload: {
      [key]: Boolean(status),
    },
  }
}

export function resetAsyncStatuses() {
  return { type: actionTypes.RESET_ASYNC }
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
  return async (dispatch, getState) => {
    db.ref('users_current_channel')
      .child(getState().auth.currentUser.uid)
      .set({
        channelId: channel.id ? channel.id : channel.uid,
        isPrivate: channel.uid ? true : false,
      })
    return dispatch(setCurrentChannelAC(channel))
  }
}

/**
 *
 * @param {Object} channel
 */
export function setCurrentChannelAC(channel) {
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

export function resetAllChannels() {
  return { type: actionTypes.RESET_CHANNELS }
}

/* MESSAGES ACTIONS */

export function addMessage(channelId, message) {
  return {
    type: actionTypes.ADD_MESSAGE,
    payload: { channelId, message },
  }
}

export function resetAllMessages() {
  return { type: actionTypes.RESET_MESSAGES }
}
