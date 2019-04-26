import { toArray, keyBy, omit } from 'lodash'
import { createReducer } from '../utils/'
import {
  SET_CHANNEL,
  CLEAR_CHANNEL,
  UPDATE_CHANNEL,
  SET_CHANNELS,
  RESET_CHANNELS,
} from '../actions/types'

const initialState = {
  currentChannel: null,
  channelsList: [],
  channelsMap: {},
}

function setChannelReducer(state, { channel }) {
  return { ...state, currentChannel: channel }
}

function setChannelsReducer(state, { channels }) {
  const channelsMap = keyBy(channels, 'id')
  return {
    ...state,
    channelsList: channels,
    channelsMap,
  }
}

function updateChannelReducer(state, { channel }) {
  const channelsMap = { ...state.channelsMap, [channel.id]: channel }
  return {
    currentChannel: channel,
    channelsList: toArray(channelsMap),
    channelsMap,
  }
}

function clearChannelReducer(state, payload) {
  const channelsMap = omit(state.channelsMap, payload.channel.id)

  return {
    currentChannel: null,
    channelsList: toArray(channelsMap),
    channelsMap,
  }
}

function resetChannelsReducer() {
  return initialState
}

export default createReducer(initialState, {
  [SET_CHANNEL]: setChannelReducer,
  [SET_CHANNELS]: setChannelsReducer,
  [UPDATE_CHANNEL]: updateChannelReducer,
  [CLEAR_CHANNEL]: clearChannelReducer,
  [RESET_CHANNELS]: resetChannelsReducer,
})
