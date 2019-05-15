const functions = require('firebase-functions')
const admin = require('firebase-admin')
const rtdb = admin.database()

/* eslint-disable no-console */

module.exports = functions.database
  .ref('private_messages/{eventChannelId}/{msgId}')
  .onCreate(async (snap, context) => {
    const msg = { id: snap.key, ...snap.val() }
    const senderId = msg.senderId
    const eventChannelId = context.params.eventChannelId

    // extracting from channel id. channel id is constructed as user1uid_|_user2uid
    const recepientId = eventChannelId.split('_|_').filter(id => id !== senderId)

    const prom = [
      rtdb.ref(`presence/${recepientId}`).once('value'), // recepient online status data snap
      rtdb.ref(`users_current_channel/${recepientId}`).once('value'), // recepient current channel data snap
    ]

    console.log(`Recepient ID: ${recepientId}`)

    return Promise.all(prom).then(([presenceSnap, currentChannelSnap]) => {
      const isRecepientOnline = presenceSnap.val().state === 'online'
      const recepeintCurrentChannelId = currentChannelSnap.val().channelId
      const unseenCountRef = rtdb.ref(
        `unseen_messages_count/${recepientId}/${eventChannelId}`
      )

      if (
        !isRecepientOnline ||
        (isRecepientOnline && recepeintCurrentChannelId !== eventChannelId)
      ) {
        return unseenCountRef.transaction(unseenCount => {
          if (unseenCount) {
            return unseenCount + 1
          } else {
            return 1
          }
        })
      }

      return null
    })
  })
