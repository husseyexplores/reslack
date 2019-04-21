import omit from 'lodash/omit'
import { createReducer } from '../utils'
import {
  USER_ONLINE,
  USER_OFFLINE,
  ADD_USER,
  REMOVE_USER,
  RESET_USERS,
} from '../actions/types'

const initialState = {
  onlineUsersMap: {},
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

function setUserOnlineReducer(state, { userId }) {
  return {
    ...state,
    onlineUsersMap: { ...state.onlineUsersMap, [userId]: true },
  }
}

function setUserOfflineReducer(state, { userId }) {
  return {
    ...state,
    onlineUsersMap: omit(state.onlineUsersMap, userId),
  }
}

function resetUsersReducer() {
  return initialState
}

export default createReducer(initialState, {
  [USER_ONLINE]: setUserOnlineReducer,
  [USER_OFFLINE]: setUserOfflineReducer,
  [ADD_USER]: addUserToListReducer,
  [REMOVE_USER]: removeUserFromListReducer,
  [RESET_USERS]: resetUsersReducer,
})
