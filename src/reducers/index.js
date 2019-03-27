import { combineReducers } from 'redux'
import userReducer from './userReducer'
import asyncReducer from './asyncReducer'
import modalReducer from './modalReducer'
import channelsReducer from './channelsReducer'

const rootReducer = combineReducers({
  auth: userReducer,
  async: asyncReducer,
  modals: modalReducer,
  channels: channelsReducer,
})

export default rootReducer
