import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Header, Input, Icon } from 'semantic-ui-react'

///////////////////////////////////////////////////////////////////////////////////////

function displayUserCount(usersCount) {
  const isSingular = usersCount === 1
  return `${usersCount} User${isSingular ? '' : 's'}`
}

// Component
function MessageHeader({ channelName, setSearchTerm, searchTerm, usersCount }) {
  return (
    <Segment clearing>
      {/* Channel Title */}
      <Header as="h2" floated="left" style={{ marginBottom: 0 }}>
        <span>
          {channelName}
          <Icon name="star outline" color="black" />
        </span>
        <Header.Subheader>{displayUserCount(usersCount)}</Header.Subheader>
      </Header>

      {/* Search Input */}
      <Header floated="right">
        <Input
          onChange={e => setSearchTerm(e.target.value)}
          value={searchTerm}
          size="mini"
          icon="search"
          name="searchTerm"
          placeholder="Search Messages"
        />
      </Header>
    </Segment>
  )
}

MessageHeader.propTypes = {
  channelName: PropTypes.string.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  usersCount: PropTypes.number.isRequired,
}

MessageHeader.defaultProps = {
  channelName: '',
  setSearchTerm: () => {},
  searchTerm: '',
  usersCount: 0,
}

export default MessageHeader
