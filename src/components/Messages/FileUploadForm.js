import React, { useState } from 'react'
import uuidv4 from 'uuid/v4'
import PropTypes from 'prop-types'
import { Segment, Button, Progress } from 'semantic-ui-react'
import { storage } from '../../firebase'

import FileUploadButton from './FileUploadButton'

import { createImageMessage } from '../../utils'

///////////////////////////////////////////////////////////////////////////////////////

function FileUploadForm({ closeModal, channelId, setPreventModalClose }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const allowedFiletypes = ['image/jpeg', 'image/png']

  const [percentUploaded, setPercentUploaded] = useState(0)
  async function uploadFile(file, meta) {
    setPreventModalClose(true)

    setLoading(true)

    const fileExtension = file.type.split('/')[1]
    const storageRef = storage.ref()
    const filePath = `chat/public/${uuidv4()}.${fileExtension}`
    const uploadTask = storageRef.child(filePath).put(file, meta)

    uploadTask.on(
      'state_changed',
      snap => {
        const perc = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
        setPercentUploaded(perc)
      },
      err => {
        console.log('Error uploading file', err) // eslint-disable-line
        setPreventModalClose(false)
      },
      (/* success */) => {
        uploadTask.snapshot.ref
          .getDownloadURL()
          .then(downloadURL => {
            return createImageMessage(downloadURL, channelId)
          })
          .then(() => {
            setLoading(false)
            setPreventModalClose(false)
            closeModal()
          })
          .catch(e => {
            setLoading(false)
            setPreventModalClose(false)
            console.log('Error getting downloadURL', e) // eslint-disable-line
          })
      }
    )
  }

  async function handleSendFile() {
    if (!file) return
    if (isAuthorized(file, allowedFiletypes)) {
      const metadata = { contentType: file.type }
      uploadFile(file, metadata)
    }
  }

  return (
    <Segment textAlign="center" basic>
      {/* <Input fluid label="File types: jpg/png" name="file" type="file" /> */}
      <FileUploadButton
        onSelect={file => setFile(file)}
        icon="upload"
        label="Select Image (jpg/png)"
        labelPosition="right"
      />
      {loading && <Progress percent={percentUploaded} progress indicating />}
      <Segment textAlign="center" basic>
        <Button
          disabled={loading || !file}
          loading={loading}
          color="green"
          icon="checkmark"
          labelPosition="left"
          content="Send"
          onClick={handleSendFile}
        />
        <Button
          color="red"
          disabled={loading}
          onClick={closeModal}
          icon="remove"
          labelPosition="left"
          content="Cancel"
        />
      </Segment>
    </Segment>
  )
}

FileUploadForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  channelId: PropTypes.string.isRequired,
  setPreventModalClose: PropTypes.func.isRequired,
}

function isAuthorized(file, allowedTypes) {
  return allowedTypes.includes(file.type)
}

export default FileUploadForm
