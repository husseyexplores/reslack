import { createReducer } from '../utils/'
import { ADD_MESSAGE, REMOVE_MESSAGE, RESET_MESSAGES } from '../actions/types'

const initialState = {}

function addMessageReducer(state, { channelId, message }) {
  if (!channelId || !message) return state

  const newState = { ...state }

  if (!Array.isArray(state[channelId])) {
    newState[channelId] = []
  }

  newState[channelId] = [...newState[channelId], message]

  return newState
}

function removeMessageReducer(state, { channelId, messageId }) {
  if (!channelId || !messageId) return state

  const newState = { ...state }

  newState[channelId] = newState[channelId].filter(msg => msg !== messageId)

  return newState
}

function resetMessagesReducer() {
  return initialState
}

export default createReducer(initialState, {
  [ADD_MESSAGE]: addMessageReducer,
  [REMOVE_MESSAGE]: removeMessageReducer,
  [RESET_MESSAGES]: resetMessagesReducer,
})
