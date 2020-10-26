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
import Footer from './components/footer';
import Home from './components/home';
import Header from './components/header';
import Vaults from './components/vault';
import Dashboard from './components/dashboard';

import { injected } from "./stores/connectors";

import {
  CONNECTION_CONNECTED,
} from './constants'

import Store from "./stores";
const emitter = Store.emitter
const store = Store.store

class App extends Component {
  state = {};
  updateAccount () {
    window.ethereum.on('accountsChanged', function (accounts) {
      store.setStore({ account: { address: accounts[0] } })

      const web3context = store.getStore('web3context')
      if(web3context) {
        emitter.emit(CONNECTION_CONNECTED)
      }
    })
  }
  componentWillMount() {
    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        injected.activate()
        .then((a) => {
          store.setStore({ account: { address: a.account }, web3context: { library: { provider: a.provider } } })
          emitter.emit(CONNECTION_CONNECTED)
        })
        .catch((e) => {
          console.log(e)
        })
      } else {

      }
    });

    if(window.ethereum) {
      this.updateAccount()
    } else {
      window.addEventListener('ethereum#initialized', this.updateAccount, {
        once: true,
      });
    }
  }

  render() {
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
              <Route path="/stats">
                <Header />
                <APR />
              </Route>
              <Route path="/earn">
                <Header />
                <InvestSimple />
              </Route>
              <Route path="/zap">
                <Header />
                <Zap />
              </Route>
              <Route path="/idai">
                <IDai />
              </Route>
              <Route path="/performance">
                <Header />
                <Performance />
              </Route>
              <Route path="/manage">
                <Header />
                <Manage />
              </Route>
              <Route path="/vaults">
                <Header />
                <Vaults />
              </Route>
              <Route path='/dashboard'>
                <Header />
                <Dashboard />
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
