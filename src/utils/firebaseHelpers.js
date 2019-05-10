import firebase, { usersRef, channelsRef, messagesRef, pmRef, pmsRef } from '../firebase'
import store from '../store'
// import {
//   asyncActionStart,
//   asyncActionFinish,
//   asyncActionError,
// } from '../actions'

//////////////////////////////////////////////////////////////////////////////////////

/**
 *
 * @param {Object} createdUser
 * @param {string} createdUser.uid
 * @param {string} createdUser.displayName
 * @param {string} createdUser.photoURL
 */
export async function saveUserToDB(createdUser) {
  return await usersRef.child(createdUser.user.uid).set({
    displayName: createdUser.user.displayName,
    avatar: createdUser.user.photoURL,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
  })
}

/**
 *
 * @param {Object} values
 * @param {string} values.channelName
 * @param {string} values.channelDescription
 */
export async function createNewChannel(channelName, channelDescription) {
  if (!channelName || !channelDescription)
    throw new Error(
      'Invalid `Channel Form` values. Expects `channelName` and `channelDescription` properties. '
    )

  try {
    const { currentUser } = store.getState().auth
    const key = await channelsRef.push().key

    const newChannel = {
      id: key,
      name: channelName,
      description: channelDescription,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      createdBy: {
        uid: currentUser.uid,
        username: currentUser.username,
        email: currentUser.email,
        avatar: currentUser.avatar,
      },
    }

    channelsRef.child(key).update(newChannel)
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Create a public channel message in firebase rtdb
 *
 * @param {string} message - Message to create
 * @param {string} channelId - Channel ID
 * @param {Object} user - User object that created the channel
 * @param {string} user.uid - User's unique ID
 * @param {string} user.username - User's username
 * @param {string} user.avatar - User's avatar
 */
const pmsCache = {}
export async function createTextMessage({ message, channelId, isPrivateChannel, user }) {
  if (!message) throw new Error('Can not create an empty message.')
  if (!user) throw new Error('Can not create a message without the sender info')
  if (!channelId)
    throw new Error('Please specify a channel ID in which to create the message.')

  const newMessage = {
    content: message,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    senderId: user.uid,
  }

  try {
    if (isPrivateChannel) {
      const { senderUid, recipientUid } = isPrivateChannel

      pmRef
        .child(channelId)
        .push()
        .set(newMessage)

      if (!pmsCache[senderUid]) {
        pmsCache[senderUid] = true
        pmsRef.child(`${senderUid}/${channelId}`).set(true)
      }

      if (!pmsCache[recipientUid]) {
        pmsCache[recipientUid] = true
        pmsRef.child(`${recipientUid}/${channelId}`).set(true)
      }
    } else {
      messagesRef
        .child(channelId)
        .push()
        .set(newMessage)
    }
  } catch (e) {
    throw e
  }
}

/**
 *
 * @param {string} imageURL - Image URL
 * @param {string} channelId - Channel ID
 * @param {Object} user - User object that created the channel
 * @param {string} user.uid - User's unique ID
 * @param {string} user.username - User's username
 * @param {string} user.avatar - User's avatar
 */
export async function createImageMessage(
  imageURL,
  channelId,
  user = store.getState().auth.currentUser
) {
  if (!imageURL) throw new Error('Can not create an empty image message.')
  if (!channelId)
    throw new Error('Please specify a channel ID in which to create the message.')

  const newMessage = {
    imageURL: imageURL,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    senderId: user.uid,
  }

  try {
    await messagesRef
      .child(channelId)
      .push()
      .set(newMessage)
  } catch (e) {
    throw new Error(e)
  }
}

export function objectToArray(object) {
  if (object && typeof object === 'object') {
    return Object.entries(object).map(e => Object.assign({}, { ...e[1], id: e[0] }))
  }
}

export function createDataTree(dataset, parentKey = 'parentId') {
  // `dataset` will be a flat array as in our firebase comments
  const hashTable = Object.create(null)
  dataset.forEach(a => (hashTable[a.id] = { ...a, childNodes: [] }))
  const dataTree = []
  dataset.forEach(a => {
    if (a[parentKey]) hashTable[a[parentKey]].childNodes.push(hashTable[a.id])
    else dataTree.push(hashTable[a.id])
  })
  return dataTree
}

export function makeSpreadable(value) {
  return Array.isArray(value) ? value : [value]
}

/**
 *
 * @param {Object} options - options object
 * @param {Array.<string>} [options.fields=[]] - Array of fields/keys to normalize
 * @param {boolean} [options.deep=false] - Deep normalize?
 * @returns {Function} return a function that accepts the data to normalize
 * @returns {Array.<Object>} return the normalized data as an array of objects
 */
export function normalizeFirestoreData({ fields = [], deep = false } = {}) {
  return data => {
    if (!data) throw new Error('`normalizeFirestoreData` needs some data to work on!')

    let _normalized

    if (Array.isArray(data)) {
      _normalized = [...data]
    } else {
      _normalized = { ...data }
      if (!_normalized.id) _normalized = objectToArray(_normalized)
    }

    if (Array.isArray(fields) && fields.length > 0) {
      for (let j = 0; j < _normalized.length; j++) {
        for (let _value, i = 0; i < fields.length; i++, _value = null) {
          _value = _normalized[j][fields[i]]

          if (_value instanceof Object) {
            // convert firestore Timestamp to JS Date object
            if (_value.constructor.name === 'Timestamp') {
              _value = _value.toDate()
              _normalized[j][fields[i]] = _value
              continue
            } else {
              // normalize nested objectes into array
              if (!_value.id) {
                _value = objectToArray(_value)
              }

              if (deep) {
                _value = normalizeFirestoreData(_value, fields)
              }

              _normalized[j][fields[i]] = _value
              continue
            }
          }
        }
      }
    }

    return _normalized
  }
}

/**
 *
 * @param {Object} e - error message from firestore
 * @param {{fallback: 'string', feedback: 'string', onlyCustom: Boolean}} customizeResponse - Object to customize error response
 */
export function firestoreErrMsg(
  err,
  { fallback = 'Something went wrong', feedback, onlyCustom = false } = {}
) {
  const errMap = {
    unauthenticated: 'Please sign-in to perform this action',
    'permission-denied': 'Permission denied',
    'not-found': 'Resource not found',
    cancelled: 'Operation cancelled',
    'deadline-exceeded': 'Server timeout. Please try again',
    aborted: 'Operation interupted. Please try again',
    unavailable: 'Sorry! This operation in unavailable. Please try again later.',
  }

  if (!onlyCustom && err.code && errMap.hasOwnProperty(err.code)) {
    return feedback ? errMap[err.code] + '. ' + feedback : errMap[err.code]
  }

  return fallback
}
