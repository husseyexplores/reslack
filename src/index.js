import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import RootContainer from './RootContainer'
// import registerServiceWorker from './registerServiceWorker'

function render() {
  ReactDOM.render(
    <Router>
      <RootContainer />
    </Router>,
    document.getElementById('root')
  )
}

if (module.hot) {
  module.hot.accept('./RootContainer', () => {
    setTimeout(render)
  })
}

render()

// registerServiceWorker();
