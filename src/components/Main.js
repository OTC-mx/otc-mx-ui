import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import Whitepaper from './Whitepaper'
import CreateCall from './CreateCall'
import OperateCall from './OperateCall'
import About from './About'
import NotFound from './NotFound'

const Main = () => (
  <div>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route exact path='/whitepaper' component={Whitepaper}/>
      <Route exact path='/call' component={CreateCall}/>
      <Route exact path='/about' component={About}/>
      <Route path='/call/' component={OperateCall}/>
      <Route path='/' component={NotFound}/>
    </Switch>
  </div>
);

export default Main;
