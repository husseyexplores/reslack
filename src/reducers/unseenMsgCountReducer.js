import { createReducer } from '../utils'
import { UPDATE_UNSEEN_MSG_COUNT } from '../actions/types'

const initialState = {}

function updateUnseenMsgCountReducer(state, { channelId, unseenCount }) {
  // payload: {
  //  channelId: '123456y',
  //  unseenCount: 2
  // }
  return { ...state, [channelId]: unseenCount }
}

export default createReducer(initialState, {
  [UPDATE_UNSEEN_MSG_COUNT]: updateUnseenMsgCountReducer,
})
