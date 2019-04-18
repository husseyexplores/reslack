import map from 'lodash/map'
import { db } from './firebase'
import store from './store'
import {
  setChannels,
  setCurrentChannel,
  addMessage,
  setLoadingFlag,
  addAvailableUser,
  addOnlineUser,
} from './actions'

const { getState, dispatch } = store

const refPaths = {}
window.refPaths = refPaths

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
          db.ref(channelMessagesPath).on('child_added', messageSnap => {
            const newMessage = { id: messageSnap.key, ...messageSnap.val() }
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
  }
}

function cleanupListeners() {
  const paths = Object.keys(refPaths)
  paths.forEach(path => {
    db.ref(path).off()
  })
}

function setupFirebaseListeners() {
  subscribeToChannelsAndMessages()
  subscribeToUsers()

  console.log(
    '%cSubscribed to Firebase Database!',
    'padding: 4px 8px; background: palevioletred;'
  )

  return function removeFirebaseListeners() {
    cleanupListeners()
    console.log(
      '%cUnsubscribed to Firebase Database!',
      'padding: 4px 8px; background: orangered;'
    )
  }
}

export default setupFirebaseListeners
