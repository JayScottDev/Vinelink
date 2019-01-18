import React from 'react'
//import { render } from 'react-dom'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import App from './App.js'

const el = document.getElementById('root')

class Main extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter basename="/compliancy-connector">
          <App />
        </BrowserRouter>
      </Provider>
    )
  }
}
ReactDOM.render(
  <Main />,
  el
);
