import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

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
    width: '100%',
  },
  header: {
    maxWidth: '1200px',
    flex: 1,
    display: 'flex',
    padding: '20px 12px',
    alignItems: 'center',
    [theme.breakpoints.up('lg')]: {
      padding: '30px 0px',
    }
  },
  brandingContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center'
  },
  brandingName: {
    paddingLeft: '12px',
    cursor: 'pointer'
  },
  brandingIcon: {
    border: '1px solid #222',
    cursor: 'pointer'
  },
  linksContainer: {
    flex: 1,
    display: 'none',
    [theme.breakpoints.up('md')]: {
      maxWidth: '500px',
      listStyleType: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      justifyContent: 'space-evenly',
    }
  },
  linksContainerMobile: {
    position: 'absolute',
    top: '50px',
    left: '0px',
    right: '0px',
    backgroundColor: '#fff',
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 99,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    }
  },
  link: {
    cursor: 'pointer',
    padding: '6px',
    borderBottom: '2px solid rgba(0, 0, 0, 0)',
    width: 'fit-content',
    '&:hover': {
      borderBottom: '2px solid #aaa'
    }
  },
  link_active: {
    borderBottom: '2px solid #aaa'
  },
  addressContainer: {
    maxWidth: '100px',
    border: '1px solid #aaa',
    padding: '6px 12px',
    background: '#fbfbfb',
    cursor: 'pointer',
    [theme.breakpoints.up('md')]: {
      maxWidth: '300px',
    }
  },
  menuIcon: {
    padding: '0px 0px 0px 6px',
    display: 'flex',
    cursor: 'pointer',
    [theme.breakpoints.up('md')]: {
      display: 'none',
      padding: '0px 20px'
    }
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
      modalOpen: false,
      menuOpen: false
    }
  }

  componentWillMount() {
    emitter.on(METAMASK_CONNECTED, this.metamaskUnlocked);

    this.menuRef = React.createRef();
    document.addEventListener("mousedown", this.clickListener);
  };

  componentWillUnmount() {
    emitter.removeListener(METAMASK_CONNECTED, this.metamaskUnlocked);
  };

  clickListener = (event) => {

    if (!this.menuRef.current || this.menuRef.current.contains(event.target)) {
      return;
    } else {
      this.toggleMenu()
    }
  };

  metamaskUnlocked = () => {
    const account = store.getStore('account')
    this.setState({ address: account.address })
  };

  render() {
    const { classes, location } = this.props;
    const {
      modalOpen,
      address,
      menuOpen
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
          <div className={ classes.linksContainer }>
            <div className={ classes.link }><Typography variant={ 'body1' }>iswap</Typography></div>
            <div className={ `${classes.link} ${classes.link_active}` }><Typography variant={ 'body1' }>iearn</Typography></div>
            <div className={ classes.link }><Typography variant={ 'body1' }>ireward</Typography></div>
            <div className={ classes.link }><Typography variant={ 'body1' }>iam</Typography></div>
            <div className={ classes.link }><Typography variant={ 'body1' }>irefer</Typography></div>
            <div className={ classes.link }><Typography variant={ 'body1' }>faq</Typography></div>
            <div className={ classes.link }><Typography variant={ 'body1' }>what</Typography></div>
          </div>
          { (address && location.pathname === '/invest') && <div className={ classes.addressContainer } onClick={this.onAddressClick}>
            <Typography variant={ 'h2' } noWrap>{ address }</Typography>
          </div>}
          { !address &&  <div className={ classes.addressContainer } onClick={this.onAddressClick}>
            <Typography variant={ 'h2' } noWrap>Connect Wallet</Typography>
          </div> }
          <div className={ classes.menuIcon }>
            <MenuIcon onClick={ this.toggleMenu } />
          </div>
          {
            menuOpen && (<div className={ classes.linksContainerMobile } ref={this.menuRef} >
              <div className={ classes.link }><Typography variant={ 'body1' }>iswap</Typography></div>
              <div className={ `${classes.link} ${classes.link_active}` }><Typography variant={ 'body1' }>iearn</Typography></div>
              <div className={ classes.link }><Typography variant={ 'body1' }>ireward</Typography></div>
              <div className={ classes.link }><Typography variant={ 'body1' }>iam</Typography></div>
              <div className={ classes.link }><Typography variant={ 'body1' }>irefer</Typography></div>
              <div className={ classes.link }><Typography variant={ 'body1' }>faq</Typography></div>
              <div className={ classes.link }><Typography variant={ 'body1' }>what</Typography></div>
            </div>)
          }
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

  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen })
  }
}

export default withRouter(withStyles(styles)(Header));
