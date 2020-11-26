import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Typography
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { withRouter } from "react-router-dom";
import { colors } from '../../theme'
import ENS from 'ethjs-ens';

import {
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  TOGGLE_DRAWER,
} from '../../constants'

import UnlockModal from '../unlock/unlockModal.jsx'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  root: {
    verticalAlign: 'top',
    width: '100%',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '40px'
    },
    zIndex: theme.zIndex.drawer - 1,
    position: 'fixed'
  },
  headerV2: {
    background: colors.white,
    border: '1px solid #d9d9d9',
    borderTop: 'none',
    width: '100%',
    display: 'flex',
    padding: '15px 32px',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'space-between',
      padding: '15px'
    }
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    cursor: 'pointer'
  },
  links: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
    }
  },
  link: {
    padding: '12px 0px',
    margin: '0px 12px',
    cursor: 'pointer',
    '&:hover': {
      paddingBottom: '9px',
      borderBottom: "3px solid "+colors.darkGray,
    }
  },
  title: {
    textTransform: 'capitalize'
  },
  linkActive: {
    padding: '12px 0px',
    margin: '0px 12px',
    cursor: 'pointer',
    paddingBottom: '9px',
    borderBottom: "3px solid "+colors.darkGray,
  },
  account: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      flex: '0'
    }
  },
  walletAddress: {
    padding: '12px',
    borderRadius: '41px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    background: 'rgba(24,160,251,0.1)',
    '&:hover': {
      background: 'rgba(47, 128, 237, 0.1)'
    },
    // [theme.breakpoints.down('sm')]: {
    //   display: 'flex',
    //   position: 'absolute',
    //   transform: 'translate(0, 200%)',
    //   border: "1px solid "+colors.borderBlue,
    //   background: colors.white
    // }
  },
  walletTitle: {
    flex: 1,
    color: colors.darkGray
  },
  name: {
    paddingLeft: '24px',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    }
  },
  menuButton: {
    marginLeft: -16,
    marginRight: 3,
  },
  addressAlias: {
    color: '#222222',
    fontSize: '14px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
    }
  }
});

class Header extends Component {

  constructor(props) {
    super()

    this.state = {
      account: store.getStore('account'),
      modalOpen: false,
      hideNav: true
    }
  }

  componentWillMount() {
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize() {
    let currentHideNav = (window.innerWidth <= 760);
    if (currentHideNav !== this.state.hideNav) {
        this.setState({hideNav: currentHideNav});
    }
  }

  componentWillUnmount() {
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    window.removeEventListener("resize", this.resize.bind(this));
  }

  connectionConnected = () => {
    this.setState({ account: store.getStore('account') })
    this.setAddressEnsName();
  };

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account') })
  }

  setAddressEnsName = async () => {
    const context = store.getStore('web3context')
    if(context && context.library && context.library.provider) {
      const provider = context.library.provider
      const account = store.getStore('account')
      const { address } = account
      const network = provider.networkVersion
      const ens = new ENS({ provider, network })
      const addressEnsName = await ens.reverse(address).catch(() => {})
      if (addressEnsName) {
        this.setState({ addressEnsName })
      }
    }
  }

  render() {
    const {
      classes
    } = this.props;

    const {
      account,
      addressEnsName,
      modalOpen,
      hideNav
    } = this.state

    var address = null;
    if (account.address) {
      address = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }
    const addressAlias = addressEnsName || address

    if (!hideNav && address == null) {
      return null;
    }

    return (
      <div className={ classes.root }>
        <div className={ classes.headerV2 }>
          {hideNav && this.renderToggleButton()}
          {hideNav && 
            <div className={ classes.icon }>
              <img
                alt=""
                src={ require('../../assets/DAOventures-logo.png') }
                height={ '25px' }
                onClick={ () => { this.nav('') } }
              />
            </div>
          }
          
          <div className={ classes.links }>
            {/* { this.renderLink('dashboard') } */}
            {/* { this.renderLink('vaults') } */}
            {/* { this.renderLink('portfolio') } */}
            {/* { this.renderLink('zap') }
            { this.renderLink('cover') }
            { this.renderLink('stats') } */}
          </div>
          <div className={ classes.account }>
            { address &&
              <div className={ classes.walletAddress }>
                <img 
                  alt="" 
                  src={require('../../assets/profile.svg')} />
                <Typography variant={ 'h4'} className={classes.addressAlias} style={{marginLeft: '10px'}} noWrap onClick={this.addressClicked} >
                { addressAlias }
              </Typography>
              </div>
            }
          </div>
        </div>
        { modalOpen && this.renderModal() }
      </div>
    )
  }

  renderToggleButton = () => {
    const { classes } = this.props;

    return (
      <IconButton
        color="inherit"
        aria-label="Open drawer"
        onClick={this.handleDrawerOpen}
        className={classes.menuButton}
      >
        <MenuIcon />
      </IconButton>
    );
  }

  renderLink = (screen) => {
    const {
      classes
    } = this.props;

    return (
      <div className={ (window.location.pathname==='/'+screen)?classes.linkActive:classes.link } onClick={ () => { this.nav(screen) } }>
        <Typography variant={'h4'} className={ `title` }>{ this.captializeFirstLetter(screen) }</Typography>
      </div>
    )
  }

  captializeFirstLetter = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  nav = (screen) => {
    if(screen === 'cover') {
      window.open("https://yinsure.finance", "_blank")
      return
    }
    this.props.history.push('/'+screen)
  }

  addressClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }

  handleDrawerOpen = () => {
    if (store.getStore('openDrawer')) {
      dispatcher.dispatch({ type: TOGGLE_DRAWER, content: { open: false } })
    } else {
      dispatcher.dispatch({ type: TOGGLE_DRAWER, content: { open: true } })
    }
  }
}

export default withRouter(withStyles(styles)(Header));
