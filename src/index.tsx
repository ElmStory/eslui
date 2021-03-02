import React from 'react'
import { render } from 'react-dom'
import { HashRouter as Router } from 'react-router-dom'

import AppProvider from './contexts/AppContext'

import App from './App'

document.addEventListener('contextmenu', (event) => event.preventDefault())

render(
  <Router>
    <AppProvider>
      <App />
    </AppProvider>
  </Router>,
  document.getElementById('root')
)
