import { sortBy } from 'lodash'
import { throws } from 'assert'

export function createReducer(initialState, fnMap) {
  return (state = initialState, { type, payload = {} }) => {
    const handler = fnMap[type]

    return handler ? handler(state, payload) : state
  }
}

export function isFormEmpty(valuesObject) {
  const emptyFields = []
  for (const key in valuesObject) {
    const value = valuesObject[key]
    if (typeof value === 'string' && !value.length) {
      emptyFields.push(key)
    }
  }

  return emptyFields.length > 0 ? emptyFields : false
}

export function isPasswordValid(pw, confirmPw) {
  if (!pw)
    throw new Error(
      'Can not validate the password. Expected to receive a value but found none.'
    )
  if (!confirmPw && pw.length < 6) {
    return false
  }

  return pw.length > 5 && pw === confirmPw
}

export function getFocusedElement() {
  let focused = document.activeElement
  if (!focused) focused = document.querySelector(':focus')

  return focused
}

export function isValidEmail(email) {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
}

// Channel Id Extractor
export function getChannelId(isPrivateChannel, currentUser, currentChannel) {
  ;[...arguments].map((arg, i) => {
    if (arg === undefined)
      throw new Error(`Missing arg #${i + 1} in "getChannelId" function`)
  })

  return isPrivateChannel
    ? sortBy([currentUser.uid, currentChannel.uid]).join('_')
    : currentChannel.id
}
