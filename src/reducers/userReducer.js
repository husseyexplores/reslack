import { createReducer } from '../utils/'
import { SET_USER } from '../actions/types'

const initialState = {
  currentUser: {},
  authenticated: false,
}

function setUserReducer(state, payload) {
  return {
    ...state,
    authenticated: payload.authenticated,
    currentUser: payload.currentUser,
  }
}

export default createReducer(initialState, {
  [SET_USER]: setUserReducer,
})
