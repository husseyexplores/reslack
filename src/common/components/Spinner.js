import React from 'react'
import PropTypes from 'prop-types'
import { Loader, Dimmer } from 'semantic-ui-react'

//////////////////////////////////////////////////////////////////////////////////

const Spinner = ({ text, size, dimmer }) =>
  dimmer ? (
    <Dimmer active inverted>
      <Loader size={size}>{text}</Loader>
    </Dimmer>
  ) : (
    <Loader size={size}>{text}</Loader>
  )

Spinner.propTypes = {
  text: PropTypes.string,
  size: PropTypes.string.isRequired,
  dimmer: PropTypes.bool.isRequired,
}

Spinner.defaultProps = {
  text: '',
  size: 'medium',
  dimmer: false,
}

export default Spinner
