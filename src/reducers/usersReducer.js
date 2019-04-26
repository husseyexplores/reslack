import omit from 'lodash/omit'
import { createReducer } from '../utils'
import {
  USER_ONLINE,
  USER_OFFLINE,
  ADD_USER,
  UPDATE_USER,
  REMOVE_USER,
  RESET_USERS,
} from '../actions/types'

const initialState = {
  onlineUsersMap: {},
  allUsersList: [],
  allUsersMap: {},
}

function addUserToListReducer(state, { user }) {
  return {
    ...state,
    allUsersList: [...state.allUsersList, user],
    allUsersMap: { ...state.allUsersMap, [user.uid]: user },
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
    allUsersMap: omit(state.allUsersMap, userId),
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

function updateUserReducer(state, { user }) {
  return {
    ...state,
    allUsersList: state.allUsersList.map(_user =>
      _user.uid === user.uid ? user : _user
    ),
    allUsersMap: { ...state.allUsersMap, [user.uid]: user },
  }
}

function resetUsersReducer() {
  return initialState
}

export default createReducer(initialState, {
  [USER_ONLINE]: setUserOnlineReducer,
  [USER_OFFLINE]: setUserOfflineReducer,
  [ADD_USER]: addUserToListReducer,
  [UPDATE_USER]: updateUserReducer,
  [REMOVE_USER]: removeUserFromListReducer,
  [RESET_USERS]: resetUsersReducer,
})
