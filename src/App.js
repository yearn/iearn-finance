import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './i18n';
import interestTheme from './theme';

import APR from './components/apr';
import InvestSimple from './components/investSimple';
import Manage from './components/manage';
import Performance from './components/performance';
import Zap from './components/zap';

class App extends Component {

  render() {

    return (
      <MuiThemeProvider theme={ createMuiTheme(interestTheme) }>
        <CssBaseline />
        <Router>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            alignItems: 'center',
            background: "#f9fafb"
          }}>
            <Switch>
              <Route path="/apr">
                <APR />
              </Route>
              <Route path="/invest">
                <InvestSimple />
              </Route>
              <Route path="/zap">
                <Zap />
              </Route>
              <Route path="/performance">
                <Performance />
              </Route>
              <Route path="/manage">
                <Manage />
              </Route>
              <Route path="/">
                <InvestSimple />
              </Route>
            </Switch>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
