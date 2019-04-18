import React from 'react'
// import PropTypes from 'prop-types';
import { Sidebar, Menu, Divider, Button } from 'semantic-ui-react'

///////////////////////////////////////////////////////////////////////////////////////

// Component
function ColorPanel() {
  return (
    <Sidebar as={Menu} icon="labeled" inverted vertical visible width="very thin">
      <Divider />
      <Button icon="add" sizz="small" color="blue" />
    </Sidebar>
  )
}

ColorPanel.propTypes = {}

ColorPanel.defaultProps = {}

export default ColorPanel
