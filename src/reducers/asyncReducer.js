import { createReducer } from '../utils/'
import {
  ASYNC_START,
  ASYNC_FINISH,
  ASYNC_ERROR,
  ASYNC_SET_FLAG,
  RESET_ASYNC,
} from '../actions/types'

const initialState = {
  isLoading: false,
  channelsLoaded: false,
  messagesLoaded: false,
  usersLoaded: false,
}

/*
TODO: Reduxify DirectMessages component
const initialState = {
  isLoading: false,
  channels: {
    inInitialized: false,
    isLoading: true,
  },
  messages: {
    inInitialized: false,
    isLoading: true,
  },
  users: {
    inInitialized: false,
    isLoading: true,
  },
  onlineUsers: {
    inInitialized: false,
    isLoading: true,
  },
}
*/

function asyncStartReducer(state, { payload }) {
  if (payload) {
    return { ...state, ...payload }
  }
  return { ...state, isLoading: true }
}

function asyncFinishReducer(state, { payload }) {
  if (payload) {
    return { ...state, ...payload }
  }

  return { ...state, isLoading: false }
}

function asyncErrorReducer(state) {
  return { ...state, isLoading: false }
}

function asyncFlagReducer(state, { ...payload }) {
  return { ...state, ...payload }
}

function asyncResetReducer() {
  return initialState
}

export default createReducer(initialState, {
  [ASYNC_START]: asyncStartReducer,
  [ASYNC_FINISH]: asyncFinishReducer,
  [ASYNC_ERROR]: asyncErrorReducer,
  [ASYNC_SET_FLAG]: asyncFlagReducer,
  [RESET_ASYNC]: asyncResetReducer,
})
