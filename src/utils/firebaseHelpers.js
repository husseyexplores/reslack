import firebase from '../firebase'

const db = firebase.database()
const usersRef = db.ref('users')

export async function saveUserToDB(createdUser) {
  return await usersRef.child(createdUser.user.uid).set({
    displayName: createdUser.user.displayName,
    avatar: createdUser.user.photoURL,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
  })
}
