import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

import { firebaseConfig } from './secrets'

firebase.initializeApp(firebaseConfig)
firebase.auth()
firebase.database()

export default firebase
