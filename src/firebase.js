import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

import { firebaseConfig } from './secrets'

firebase.initializeApp(firebaseConfig)

export default firebase
window.db = firebase.database()
export const db = firebase.database()
export const auth = firebase.auth()
export const storage = firebase.storage()

// Refs
export const usersRef = db.ref('users')
export const channelsRef = db.ref('channels')
export const messagesRef = db.ref('messages')
export const privateMsgsSubscriptionsRef = db.ref('/private_messages_subscriptions')
export const privateMsgsRef = db.ref('/private_messages')
