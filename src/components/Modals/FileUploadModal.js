import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, Icon } from 'semantic-ui-react'

import FileUploadForm from '../Messages/FileUploadForm'

import { closeModal } from '../../actions'

///////////////////////////////////////////////////////////////////////////////

function FileUploadModal({ closeModal, ...restProps }) {
  const [preventModalClose, setPreventModalClose] = useState(false)

  return (
    <Modal
      size="mini"
      dimmer="inverted"
      open={true}
      onClose={closeModal}
      closeOnDimmerClick={!preventModalClose}
      closeOnEscape={!preventModalClose}
      closeIcon={preventModalClose ? null : <Icon name="close" color="grey" />}
    >
      <Modal.Header>Upload Media</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <FileUploadForm
            {...restProps}
            closeModal={closeModal}
            setPreventModalClose={setPreventModalClose}
          />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}

FileUploadModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
}

const mapDispatch = {
  closeModal,
}

export default connect(
  null,
  mapDispatch
)(FileUploadModal)
