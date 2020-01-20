import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import UnlockModal from '../unlock/unlockModal.jsx'

import {
  CONNECT_METAMASK,
  METAMASK_CONNECTED
} from '../../constants'

import Store from "../../stores";
const dispatcher = Store.dispatcher
const emitter = Store.emitter
const store = Store.store

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-around',
    background: '#fff',
    borderBottom: '1px solid #aaa',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    width: '100%'
  },
  header: {
    maxWidth: '1280px',
    flex: 1,
    display: 'flex',
    padding: '30px 0px'
  },
  brandingContainer: {
    flex: 1,
    display: 'flex'
  },
  brandingName: {
    paddingLeft: '12px',
    cursor: 'pointer'
  },
  brandingIcon: {
    border: '1px solid #222',
    cursor: 'pointer'
  },
  addressContainer: {
    maxWidth: '300px',
    border: '1px solid #aaa',
    padding: '6px 12px',
    background: '#fbfbfb',
    cursor: 'pointer'
  }
});

class Header extends Component {
  constructor(props) {
    super();

    if(props.location.pathname === '/invest') {
      dispatcher.dispatch({ type: CONNECT_METAMASK, content: {} })
    }

    this.state = {
      address: null,
      modalOpen: false
    }
  }

  componentWillMount() {
    emitter.on(METAMASK_CONNECTED, this.metamaskUnlocked);
  };

  componentWillUnmount() {
    emitter.removeListener(METAMASK_CONNECTED, this.metamaskUnlocked);
  };

  metamaskUnlocked = () => {
    const account = store.getStore('account')
    this.setState({ address: account.address })
  };

  render() {
    const { classes, location } = this.props;
    const {
      modalOpen,
      address
    } = this.state

    return (
      <div className={ classes.root }>
        <div className={ classes.header }>
          <div className={ classes.brandingContainer }>
            <div className={ classes.brandingIcon } onClick={ this.navigateHome }>icon</div>
            <div className={ classes.brandingName } onClick={ this.navigateHome }>
              <Typography variant={ 'h1' }>iearn finance</Typography>
            </div>
          </div>
          { (address && location.pathname === '/invest') && <div className={ classes.addressContainer } onClick={this.onAddressClick}>
            <Typography variant={ 'h2' } noWrap>{ address }</Typography>
          </div>}
        </div>

        { modalOpen && this.renderModal() }
      </div>
    )
  };

  navigateHome = () => {
    this.props.history.push('/')
  }

  onAddressClick = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } />
    )
  }
}

export default withRouter(withStyles(styles)(Header));
