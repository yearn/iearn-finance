import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Card,
  TextField,
  Button
} from '@material-ui/core';

import UnlockModal from '../unlock/unlockModal.jsx'
import InvestModal from './investModal.jsx'
import RedeemModal from './redeemModal.jsx'
import Snackbar from '../snackbar'

import {
  ERROR,
  GET_ETH_BALANCE,
  GET_IETH_BALANCE,
  ETH_BALANCE_RETURNED,
  IETH_BALANCE_RETURNED,
  INVEST,
  INVEST_RETURNED,
  REDEEM,
  REDEEM_RETURNED,
  METAMASK_CONNECTED
} from '../../constants'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    maxWidth: '1200px',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  investedContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  referralLink: {
    padding: '12px',
    [theme.breakpoints.up('md')]: {
      minWidth: '450px'
    }
  },
  actionInput: {

  },
  balancesContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    padding: '12px',
    position: 'relative',
    [theme.breakpoints.up('md')]: {
      minWidth: '450px'
    }
  },
  balances: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between'
  },
  actionsContainer: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '450px',
    [theme.breakpoints.up('md')]: {
      width: '450',
    }
  },
  intro: {
    padding: '12px',
    textAlign: 'center',
    maxWidth: '500px'
  },
  title: {
    paddingRight: '24px'
  },
  actionButton: {
    padding: '12px',
    minWidth: '120px',
    [theme.breakpoints.up('md')]: {
      padding: '15px',
      minWidth: '150px',
    }
  },
  overlay: {
    position: 'absolute',
    borderRadius: '10px',
    background: 'RGBA(200, 200, 200, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #aaa',
    cursor: 'pointer',

    right: '0px',
    top: '10px',
    height: '70px',
    width: '160px',
    [theme.breakpoints.up('md')]: {
      right: '0px',
      top: '10px',
      height: '90px',
      width: '210px',
    }
  }
});

class InvestSimple extends Component {

  constructor() {
    super()

    this.state = {
      ethBalance: store.getStore('ethBalance'),
      iEthBalance: store.getStore('iEthBalance'),
      referralLink: '',
      roi: 4,
      account: store.getStore('account'),
      modalOpen: false,
      investModalOpen: false,
      redeemModalOpen: false,
      snackbarType: null,
      snackbarMessage: null
    }
  }

  componentWillMount() {
    emitter.on(ETH_BALANCE_RETURNED, this.balancesReturned);
    emitter.on(IETH_BALANCE_RETURNED, this.balancesReturned);
    emitter.on(METAMASK_CONNECTED, this.metamaskConnected);
    emitter.on(INVEST_RETURNED, this.investReturned);
    emitter.on(REDEEM_RETURNED, this.redeemReturned);
    emitter.on(ERROR, this.errorReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ETH_BALANCE_RETURNED, this.balancesReturned);
    emitter.removeListener(IETH_BALANCE_RETURNED, this.balancesReturned);
    emitter.removeListener(METAMASK_CONNECTED, this.metamaskConnected);
    emitter.removeListener(INVEST_RETURNED, this.investReturned);
    emitter.removeListener(REDEEM_RETURNED, this.redeemReturned);
    emitter.removeListener(ERROR, this.errorReturned);
  };

  balancesReturned = (balances) => {
    this.setState({ ethBalance: store.getStore('ethBalance') })
    this.setState({ iEthBalance: store.getStore('iEthBalance') })
  };

  metamaskConnected = () => {
    this.setState({ account: store.getStore('account') })

    dispatcher.dispatch({ type: GET_ETH_BALANCE, content: {} })
    dispatcher.dispatch({ type: GET_IETH_BALANCE, content: {} })
  };

  errorReturned = (error) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)

    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error' }
      that.setState(snackbarObj)
    })
  };

  investReturned = (txHash) => {
    const snackbarObj = { snackbarMessage: 'TX: ' + txHash, snackbarType: 'Success' }
    this.setState(snackbarObj)
  };

  redeemReturned = (txHash) => {
    const snackbarObj = { snackbarMessage: 'TX: ' + txHash, snackbarType: 'Success' }
    this.setState(snackbarObj)
  };

  render() {
    const { classes } = this.props;
    const {
      referralLink,
      referralLinkError,
      loading,
      ethBalance,
      iEthBalance,
      roi,
      account,
      modalOpen,
      investModalOpen,
      redeemModalOpen,
      snackbarMessage
    } = this.state

    return (
      <div className={ classes.root }>
        <div className={ classes.investedContainer }>
          <div className={ classes.intro }>
            <Typography variant='h3'>Welcome to iearn.finance. We will convert your Ethereum (Eth) into Interest Bearing Ethereum (iEth). Get started by clicking on the Invest button below.</Typography>
          </div>
          <div className={ classes.referralLink }>
            <TextField
              fullWidth
              className={ classes.actionInput }
              id='referralLink'
              value={ referralLink }
              error={ referralLinkError }
              onChange={ this.onChange }
              disabled={ loading }
              label="Referral Link"
              placeholder="ref"
              variant="outlined"
              onKeyDown={ this.inputKeyDown }
              helperText='Somemthing to help the user understand what the referral link gives them'
            />
          </div>
          <div className={ classes.balancesContainer }>
            <div className={ classes.balances }>
              <Typography variant='h1' className={ classes.title }>Eth not earning interest: </Typography><Typography variant='h4' className={ classes.value } noWrap>{ ethBalance ? ethBalance.toFixed(4) : '0.0000' } Eth</Typography>
            </div>
            <div className={ classes.balances }>
              <Typography variant='h1' className={ classes.title }>Eth earning interest: </Typography><Typography variant='h4' className={ classes.value } noWrap>{ iEthBalance ? iEthBalance.toFixed(4) : '0.0000' } Eth</Typography>
            </div>
            <div className={ classes.balances }>
              <Typography variant='h1' className={ classes.title }>Current ROI: </Typography><Typography variant='h4' className={ classes.value } noWrap>{ roi ? roi.toFixed(4) : '0.0000' } %</Typography>
              </div>
            { !account.address && <div className={ classes.overlay } onClick={ this.overlayClicked }>
              <Typography variant='h1' >Connect wallet</Typography>
            </div>}
          </div>
          <div className={ classes.actionsContainer }>
            <Button
              className={ classes.actionButton }
              variant="contained"
              color="secondary"
              disabled={ loading || !account.address }
              onClick={ this.investClicked }
              >
              <Typography className={ classes.buttonText } variant={ 'h3'}>Invest</Typography>
            </Button>
            <Button
              className={ classes.actionButton }
              variant="contained"
              color="secondary"
              disabled={ loading || !account.address }
              onClick={ this.redeemClicked }
              >
              <Typography className={ classes.buttonText } variant={ 'h3'}>Redeem</Typography>
            </Button>
          </div>
        </div>
        { modalOpen && this.renderModal() }
        { investModalOpen && this.renderInvestModal() }
        { redeemModalOpen && this.renderRedeemModal() }
        { snackbarMessage && this.renderSnackbar() }
      </div>
    )
  };

  renderSnackbar() {
    const {
      snackbarType,
      snackbarMessage
    } = this.state

    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true} />
  };

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  inputKeyDown = (event) => {
    if (event.which === 13) {
      this.onInvest();
    }
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } />
    )
  }

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  renderInvestModal = () => {
    return (
      <InvestModal closeModal={ this.closeInvestModal } />
    )
  }

  investClicked = () => {
    this.setState({ investModalOpen: true })
  }

  closeInvestModal = () => {
    this.setState({ investModalOpen: false })
  }

  renderRedeemModal = () => {
    return (
      <RedeemModal closeModal={ this.closeRedeemModal } />
    )
  }

  redeemClicked = () => {
    this.setState({ redeemModalOpen: true })
  }

  closeRedeemModal = () => {
    this.setState({ redeemModalOpen: false })
  }
}

export default withRouter(withStyles(styles)(InvestSimple));
