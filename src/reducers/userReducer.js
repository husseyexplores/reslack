import { createReducer } from '../utils/'
import { SET_USER } from '../actions/types'

const initialState = {
  currentUser: null,
  authenticated: false,
}

function setUserReducer(state, payload) {
  return {
    ...state,
    authenticated: Boolean(payload.currentUser),
    currentUser: payload.currentUser,
  }
}

export default createReducer(initialState, {
  [SET_USER]: setUserReducer,
})
