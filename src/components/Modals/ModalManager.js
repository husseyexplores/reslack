import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ChannelFormModal from './ChannelFormModal'

/////////////////////////////////////////////////////////////////////////////////

const modalMap = {
  ChannelFormModal,
}

function mapState(state) {
  return {
    currentModal: state.modals,
  }
}

// Component
function ModalManager({ currentModal }) {
  if (!currentModal) return null

  const { modalType, modalProps } = currentModal
  const ModalComponent = modalMap[modalType]

  return <ModalComponent {...modalProps} />
}

ModalManager.propTypes = {
  currentModal: PropTypes.object,
}

export default connect(mapState)(ModalManager)
