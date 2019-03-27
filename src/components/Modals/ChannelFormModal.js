import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, Icon } from 'semantic-ui-react'

import ChannelForm from '../SidePanel/ChannelForm'

import { closeModal } from '../../actions'

///////////////////////////////////////////////////////////////////////////////

const mapDispatch = {
  closeModal,
}

function ChannelFormModal({ closeModal, ...restProps }) {
  return (
    <Modal
      size="tiny"
      dimmer="inverted"
      open={true}
      onClose={closeModal}
      closeIcon={<Icon name="close" color="grey" />}
    >
      <Modal.Header>Add a Channel</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <ChannelForm {...restProps} closeModal={closeModal} />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}

ChannelFormModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
}

export default connect(
  null,
  mapDispatch
)(ChannelFormModal)
