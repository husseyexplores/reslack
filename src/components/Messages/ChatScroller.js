import React from 'react'
import { node, object } from 'prop-types'

/////////////////////////////////////////////////////////////////////////////////

class ChatScroll extends React.Component {
  static propTypes = {
    scrollerRef: object.isRequired,
    children: node,
  }

  componentDidMount() {
    this.scroll()
  }

  getSnapshotBeforeUpdate() {
    const node = this.props.scrollerRef.current
    if (node) {
      const { scrollHeight, scrollTop, clientHeight } = node
      const pinnedToBottom = scrollTop + clientHeight === scrollHeight

      this.scrolledUp = !pinnedToBottom

      return null
    }
  }

  componentDidUpdate() {
    if (!this.scrolledUp) {
      this.scroll()
    }
  }

  scroll() {
    if (this.props.scrollerRef.current) {
      this.props.scrollerRef.current.scrollTop = this.props.scrollerRef.current.scrollHeight
    }
  }

  render() {
    const { children } = this.props
    return children ? children : null
  }
}

export default ChatScroll
