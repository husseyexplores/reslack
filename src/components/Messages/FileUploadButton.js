import * as React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

export class FileButton extends React.Component {
  constructor(props) {
    super(props)

    this.fileRef = React.createRef()
    this.onChangeFile = this.onChangeFile.bind(this)
    this.state = {
      file: null,
    }
  }

  onChangeFile() {
    const file =
      this.fileRef && this.fileRef.current ? this.fileRef.current.files[0] : null

    if (file) {
      this.props.onSelect(file)
      this.setState({ file })
    }
  }

  renderFileDetails(file) {
    const sizeInKB = Math.round(file.size / 1024)
    return (
      <p>
        {file.name} - {sizeInKB} kb
      </p>
    )
  }

  render() {
    const { file } = this.state
    const { multiple } = this.props
    return (
      <div>
        <Button {...this.props} onClick={() => this.fileRef.current.click()} />
        <input
          ref={this.fileRef}
          hidden
          type="file"
          onChange={this.onChangeFile}
          multiple={multiple}
        />
        {file && this.renderFileDetails(file)}
      </div>
    )
  }
}

FileButton.propTypes = {
  onSelect: PropTypes.func.isRequired,
  multiple: PropTypes.bool.isRequired,
}

FileButton.defaultProps = {
  onSelect: () => {},
  multiple: false,
}

export default FileButton
