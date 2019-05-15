import { unseenMsgCountRef } from '../../firebase'

const resetUnseenMsgCount = store => next => action => {
  const channelChanged = action.type === 'SET_CHANNEL'

  if (channelChanged) {
    // channel changed. Reset messages for this channel
    const currentUserId = store.getState().auth.currentUser.uid
    const { id: channelId } = action.payload.channel

    unseenMsgCountRef
      .child(currentUserId)
      .child(channelId)
      .set(0)
  }
  next(action)
}

export default resetUnseenMsgCount
