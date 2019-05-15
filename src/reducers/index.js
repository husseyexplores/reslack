import { combineReducers } from 'redux'
import userReducer from './userReducer'
import usersReducer from './usersReducer'
import asyncReducer from './asyncReducer'
import modalReducer from './modalReducer'
import channelsReducer from './channelsReducer'
import messagesReducer from './messagesReducer'
import unseenMsgCountReducer from './unseenMsgCountReducer'

const rootReducer = combineReducers({
  users: usersReducer,
  auth: userReducer,
  status: asyncReducer,
  modals: modalReducer,
  channels: channelsReducer,
  messages: messagesReducer,
  unseenCount: unseenMsgCountReducer,
})

export default rootReducer
