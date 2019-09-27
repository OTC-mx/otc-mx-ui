import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import CreateCall from './CreateCall'
import OperateCall from './OperateCall'
import Contact from './Contact'
import NotFound from './NotFound'

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route exact path='/call' component={CreateCall}/>
      <Route exact path='/contact' component={Contact}/>
      <Route path='/call/' component={OperateCall}/>
      <Route path='/' component={NotFound}/>
    </Switch>
  </main>
)

export default Main;
