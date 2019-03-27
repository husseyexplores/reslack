import _toArray from 'lodash/toArray'
import _keyBy from 'lodash/keyBy'
import { createReducer } from '../utils/'
import {
  SET_CHANNEL,
  CLEAR_CHANNEL,
  CLEAR_CHANNELS,
  UPDATE_CHANNEL,
  SET_CHANNELS,
} from '../actions/types'

const initialState = {
  currentChannel: null,
  channelsList: [],
  channelsMap: {},
}

function setChannelReducer(state, { channel }) {
  // stop the function if the current channel is already in state
  if (state.channelsMap[channel.id]) return state

  const channelsMap = { ...state.channelsMap, [channel.id]: channel }
  return {
    currentChannel: channel,
    channelsList: _toArray(channelsMap),
    channelsMap,
  }
}

function setChannelsReducer(state, { channels }) {
  const channelsMap = _keyBy(channels, 'id')
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
    channelsList: _toArray(channelsMap),
    channelsMap,
  }
}

function clearChannelReducer(state, payload) {
  const channelsMap = { ...state.channelsMap }
  delete channelsMap[payload.channel.id]

  return {
    currentChannel: null,
    channelsList: _toArray(channelsMap),
    channelsMap,
  }
}

function clearChannelsReducer() {
  return { ...initialState }
}

export default createReducer(initialState, {
  [SET_CHANNEL]: setChannelReducer,
  [SET_CHANNELS]: setChannelsReducer,
  [UPDATE_CHANNEL]: updateChannelReducer,
  [CLEAR_CHANNEL]: clearChannelReducer,
  [CLEAR_CHANNELS]: clearChannelsReducer,
})
