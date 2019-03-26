import { combineReducers } from 'redux'
import userReducer from './userReducer'
import asyncReducer from './asyncReducer'

const rootReducer = combineReducers({
  auth: userReducer,
  async: asyncReducer,
})

export default rootReducer
