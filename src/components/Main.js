import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Whitepaper from './pages/Whitepaper';
import CreateCall from './pages/CreateCall';
import CreateSilentCall from './pages/CreateSilentCall';
import OperateCall from './pages/OperateCall';
import OperateSilentCall from './pages/OperateSilentCall';
import About from './pages/About';
import NotFound from './pages/NotFound';

const Main = () => (
  <div>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route exact path='/whitepaper' component={Whitepaper}/>
      <Route exact path='/call' component={CreateCall}/>
      <Route exact path='/silentcall' component={CreateSilentCall}/>
      <Route exact path='/about' component={About}/>
      <Route path='/call/' component={OperateCall}/>
      <Route path='/silentcall/' component={OperateSilentCall}/>
      <Route path='/' component={NotFound}/>
    </Switch>
  </div>
);

export default Main;
