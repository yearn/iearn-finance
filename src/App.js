import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import APR from './components/apr';
import Home from './components/home';
import IDai from './components/idai';
import InvestSimple from './components/investSimple';
import Manage from './components/manage';
import Marketing from './components/marketing';
import Performance from './components/performance';
import Zap from './components/zap';
import './i18n';
import interestTheme from './theme';



class App extends Component {

  render() {

    return (
      <MuiThemeProvider theme={createMuiTheme(interestTheme)}>
        <CssBaseline />
        <Router>
          <div>
            <Switch>
              <Route exact path="/" component={Marketing} />
              <Route path="/home">
                <Home />
              </Route>
              <Route path="/apr">
                <APR />
              </Route>
              <Route path="/earn">
                <InvestSimple />
              </Route>
              <Route path="/zap">
                <Zap />
              </Route>
              <Route path="/idai">
                <IDai />
              </Route>
              <Route path="/performance">
                <Performance />
              </Route>
              <Route path="/manage">
                <Manage />
              </Route>
              {/*<Route path="/cover">
                <Insure />
              </Route>*/}
            </Switch>
          </div>
        </Router>
      </MuiThemeProvider>
    )
  }
}

export default App;
