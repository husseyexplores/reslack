import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Header, Input, Icon } from 'semantic-ui-react'

///////////////////////////////////////////////////////////////////////////////////////

function MessageHeader({
  channelName,
  setSearchTerm,
  searchTerm,
  usersCount,
  isPrivateChannel,
}) {
  return (
    <Segment clearing>
      {/* Channel Title */}
      <Header as="h2" floated="left" style={{ marginBottom: 0 }}>
        <span>
          {channelName}
          <Icon name="star outline" color="black" />
        </span>
        {!isPrivateChannel && (
          <Header.Subheader>{displayUserCount(usersCount)}</Header.Subheader>
        )}
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
  isPrivateChannel: PropTypes.bool.isRequired,
}

MessageHeader.defaultProps = {
  channelName: '',
  setSearchTerm: () => {},
  searchTerm: '',
  usersCount: 0,
}

function displayUserCount(usersCount) {
  const isSingular = usersCount === 1
  return `${usersCount} User${isSingular ? '' : 's'}`
}

export default MessageHeader
