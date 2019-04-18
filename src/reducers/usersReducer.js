import { createReducer } from '../utils'
import { USER_ONLINE, USER_OFFLINE, ADD_USER, REMOVE_USER } from '../actions/types'

const initialState = {
  onlineUsersList: [],
  allUsersList: [],
}

function addUserToListReducer(state, { user }) {
  return {
    ...state,
    allUsersList: [...state.allUsersList, user],
  }
}

function removeUserFromListReducer(state, { user }) {
  let userId
  if (typeof user === 'object' && user.id) {
    userId = user.id
  } else if (typeof user.id === 'string') {
    userId = user
  }

  return {
    ...state,
    allUsersList: state.allUsersList.filter(oldUsers => oldUsers.id !== userId),
  }
}

function setUserOnlineReducer(state, { user }) {
  return {
    ...state,
    onlineUsersList: [...state.onlineUsersList, user],
  }
}

function setUserOfflineReducer(state, { user }) {
  let userId
  if (typeof user === 'object' && user.id) {
    userId = user.id
  } else if (typeof user.id === 'string') {
    userId = user
  }

  return {
    ...state,
    onlineUsersList: state.onlineUsersList.filter(oldUsers => oldUsers.id !== userId),
  }
}

export default createReducer(initialState, {
  [USER_ONLINE]: setUserOnlineReducer,
  [USER_OFFLINE]: setUserOfflineReducer,
  [ADD_USER]: addUserToListReducer,
  [REMOVE_USER]: removeUserFromListReducer,
})
