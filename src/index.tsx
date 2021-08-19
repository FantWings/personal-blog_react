import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import 'antd/dist/antd.css'

import './index.css'
import Router from './Router'

ReactDOM.render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>,
  document.getElementById('root')
)
