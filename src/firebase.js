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
