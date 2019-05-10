import map from 'lodash/map'
import { db } from './firebase'
import store from './store'
import {
  setChannels,
  setCurrentChannel,
  addMessage,
  setLoadingFlag,
  addAvailableUser,
  updateAvailableUser,
  addOnlineUser,
  removeOnlineUser,
  resetAllChannels,
  resetAllMessages,
  resetAllUsers,
  resetAsyncStatuses,
} from './actions'

const { getState, dispatch } = store

const refPaths = {}
window.refPaths = refPaths

// PUBLIC CHANNELS
function subscribeToChannelsAndMessages() {
  const path = '/channels'

  if (!refPaths[path]) {
    // subscribe to channels list
    dispatch(setLoadingFlag('channelsLoaded', false))
    dispatch(setLoadingFlag('messagesLoaded', false))

    db.ref(path).on('value', snap => {
      const channelsList = map(snap.val(), (value, key) => ({ id: key, ...value }))
      dispatch(setChannels(channelsList))
      if (channelsList.length > 0) dispatch(setCurrentChannel(channelsList[0]))
      dispatch(setLoadingFlag('channelsLoaded', true))
      if (!refPaths[path]) {
        refPaths[path] = true
      }

      // subscribe to channel messages
      channelsList.forEach(channel => {
        const channelMessagesPath = `/messages/${channel.id}`
        if (!refPaths[channelMessagesPath]) {
          db.ref(channelMessagesPath).on('child_added', msgSnap => {
            const newMessage = { id: msgSnap.key, ...msgSnap.val() }
            dispatch(addMessage(channel.id, newMessage))

            if (!refPaths[channelMessagesPath]) {
              refPaths[channelMessagesPath] = true
              if (!getState().status.messagesLoaded) {
                dispatch(setLoadingFlag('messagesLoaded', true))
              }
            }
          })
        }
      })
    })
  }
}

// PRIVATE CHANNELS
function subscribeToPrivateChannelsAndMessages() {
  const channelsPath = `/pms/${getState().auth.currentUser.uid}`
  if (!refPaths[channelsPath]) {
    refPaths[channelsPath] = true

    db.ref(channelsPath).on('child_added', snap => {
      const pvtChannelId = snap.key
      const privateMsgChannelPath = `/pm/${pvtChannelId}`
      if (!refPaths[privateMsgChannelPath]) {
        refPaths[privateMsgChannelPath] = true
        db.ref(privateMsgChannelPath).on('child_added', msgSnap => {
          const newMessage = { id: msgSnap.key, ...msgSnap.val() }
          dispatch(addMessage(snap.key, newMessage))
        })
      }
    })
  }
}

// ALL USERS
function subscribeToUsers() {
  const path = '/users'

  if (!refPaths[path]) {
    // subscribe to users list
    dispatch(setLoadingFlag('usersLoaded', false))

    db.ref(path).on('child_added', snap => {
      const user = { uid: snap.key, ...snap.val() }
      dispatch(addAvailableUser(user))

      if (!refPaths[path]) {
        refPaths[path] = true
        if (!getState().status.usersLoaded) {
          dispatch(setLoadingFlag('usersLoaded', true))
        }
      }
    })

    db.ref(path).on('child_changed', snap => {
      const user = { uid: snap.key, ...snap.val() }
      dispatch(updateAvailableUser(user))
    })
  }
}

// ONLINE USERS
function updateOnlinePresence() {
  const connectRefPath = '.info/connected'
  const presenceRefPath = '/presence'

  if (!refPaths[connectRefPath]) {
    refPaths[connectRefPath] = true

    const connectedRef = db.ref(connectRefPath)
    const presenceRef = db.ref(presenceRefPath)
    const { currentUser } = getState().auth

    connectedRef.on('value', snap => {
      if (snap.val() === true) {
        dispatch(addOnlineUser(currentUser.uid))
        const ref = presenceRef.child(currentUser.uid)
        ref.set(true)
        ref.onDisconnect().remove()
      } else {
        dispatch(removeOnlineUser(currentUser.uid))
        presenceRef.child(currentUser.uid).remove()
      }
    })
  }
}

function subscribeToOnlineUsers() {
  const path = '/presence'

  if (!refPaths[path]) {
    refPaths[path] = true
    const presenceRef = db.ref(path)

    presenceRef.on('child_added', snap => {
      const userId = snap.key
      dispatch(addOnlineUser(userId))
    })

    presenceRef.on('child_removed', snap => {
      const userId = snap.key
      dispatch(removeOnlineUser(userId))
    })
  }
}

// CLEANUP LISTENERS
function cleanupListeners() {
  const paths = Object.keys(refPaths)
  paths.forEach(path => {
    db.ref(path).off()
    refPaths[path] = false
  })

  const resetActionCreators = [
    resetAllChannels,
    resetAllMessages,
    resetAllUsers,
    resetAsyncStatuses,
  ]
  resetActionCreators.forEach(actionCreator => dispatch(actionCreator()))
}

function setupFirebaseListeners() {
  subscribeToUsers()
  subscribeToOnlineUsers()
  updateOnlinePresence()
  subscribeToChannelsAndMessages()
  subscribeToPrivateChannelsAndMessages()

  console.log(
    '%cSubscribed to Firebase Database!',
    'padding: 4px 8px; background: palevioletred;'
  )

  return function removeFirebaseListeners() {
    cleanupListeners()
    console.log(
      '%cUnsubscribed from Firebase Database!',
      'padding: 4px 8px; background: orangered;'
    )
  }
}

export default setupFirebaseListeners
