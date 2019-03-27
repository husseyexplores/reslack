import { createReducer } from '../utils/'
import { MODAL_OPEN, MODAL_CLOSE } from '../actions/types'

const initialState = null

function openModalReducer(state, payload) {
  const { modalType, modalProps } = payload
  return { modalType, modalProps }
}

function closeModalReducer() {
  return null
}

export default createReducer(initialState, {
  [MODAL_OPEN]: openModalReducer,
  [MODAL_CLOSE]: closeModalReducer,
})
