import React from 'react'
import ReactDom from 'react-dom'

//样式
import '../stylesheets/index.scss'

//组件
import App from './components/pages/App'


ReactDom.render(
  <App/>
, document.getElementById('app'))
