import React from 'react'
import Header from './Header'
import Main from './Main'
import Footer from './Footer'
import './App.css'

const App = () => (
  <div>
    <div id="page-container">
      <div id="upper">
        <Header />
        <Main />
      </div>
      <div id="footer">
        <Footer />
      </div>
    </div>
  </div>
)

export default App;
