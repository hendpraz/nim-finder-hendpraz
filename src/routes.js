import React from 'react';
import {BrowserRouter as Router, Route,  Switch} from 'react-router-dom';

import Home from '././components/Home/Home';
import NotFound from '././components/NotFound/NotFound';

const Routes = () => (
  <Router>
      <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="*" component={NotFound}/>
      </Switch>
  </Router>
);

export default Routes;
