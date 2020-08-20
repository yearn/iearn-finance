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

import APR from './components/aprNew';
import InvestSimple from './components/investSimpleNew';
import Manage from './components/manage';
import Performance from './components/performance';
import Zap from './components/zapNew';
import IDai from './components/idai';
import Home from './components/home';
import Vaults from './components/poolNew';
import Header from './components/headerNew';
import Footer from './components/footerNew';

import { injected } from "./stores/connectors";

import {
  CONNECTION_CONNECTED,
} from './constants'

import Store from "./stores";
const emitter = Store.emitter
const store = Store.store

class App extends Component {
  state = {
    headerValue: null,
    accGlobal: null
  };

  setHeaderValue = (newValue) => {
    this.setState({ headerValue: newValue })
  };

  componentWillMount() {
    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        injected.activate()
        .then((a) => {
          store.setStore({ account: { address: a.account }, web3context: { library: { provider: a.provider } } })
          emitter.emit(CONNECTION_CONNECTED)
          console.log(a)
        })
        .catch((e) => {
          console.log(e)
        })
      } else {

      }
    });
  }

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
            backgroundImage: `url(${require(`./assets/bg.png`)})`,
            backgroundPosition: 'left bottom',
          }}>
            <Header />
            <Switch>
              <Route path="/apr">
                <APR accGlobal={this.state.accGlobal} setAccGlobal={(accGlobal) => this.setState({ accGlobal })} />
              </Route>
              <Route path="/earn">
                <InvestSimple accGlobal={this.state.accGlobal} setAccGlobal={(accGlobal) => this.setState({ accGlobal })} />
              </Route>
              <Route path="/zap">
                <Zap accGlobal={this.state.accGlobal} setAccGlobal={(accGlobal) => this.setState({ accGlobal })} />
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
              <Route path="/vaults">
                <Vaults accGlobal={this.state.accGlobal} setAccGlobal={(accGlobal) => this.setState({ accGlobal })} />
              </Route>
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
