import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {
  Switch,
  Route
} from "react-router-dom";
import IpfsRouter from 'ipfs-react-router'

import './i18n';
import interestTheme from './theme';

import APR from './components/apr';
import InvestSimple from './components/investSimple';
import Manage from './components/manage';
import Performance from './components/performance';
import Zap from './components/zap';
import IDai from './components/idai';
// import Insure from './components/insure';
import Footer from './components/footer';
import Home from './components/home';
// import Pool from './components/pool';
// import Balancer from './components/balancer';
import Header from './components/header';

class App extends Component {
  state = {
    headerValue: null
  };

  setHeaderValue = (newValue) => {
    this.setState({ headerValue: newValue })
  };

  render() {

    const { headerValue } = this.state

    return (
      <MuiThemeProvider theme={ createMuiTheme(interestTheme) }>
        <CssBaseline />
        <IpfsRouter>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            alignItems: 'center',
            background: "#f9fafb"
          }}>
            <Switch>
              <Route path="/apr">
                <Header setHeaderValue={ this.setHeaderValue } headerValue={ headerValue } />
                <APR />
              </Route>
              <Route path="/earn">
                <Header setHeaderValue={ this.setHeaderValue } headerValue={ headerValue } />
                <InvestSimple />
              </Route>
              <Route path="/zap">
                <Header setHeaderValue={ this.setHeaderValue } headerValue={ headerValue } />
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
                <Header setHeaderValue={ this.setHeaderValue } headerValue={ headerValue } />
                <Insure />
              </Route>
              <Route path="/pool">
                <Header setHeaderValue={ this.setHeaderValue } headerValue={ headerValue } />
                <Pool />
              </Route>
              <Route path="/balancer">
                <Balancer />
              </Route>*/}
              <Route path="/">
                <Home />
              </Route>
            </Switch>
            <Footer />
          </div>
        </IpfsRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
