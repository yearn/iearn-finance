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
  CONNECT_METAMASK,
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
    justifyContent: 'center',
    marginTop: '60px',
    [theme.breakpoints.up('md')]: {
      alignItems: 'center',
      marginTop: '0px',
    }
  },
  value: {
    cursor: 'pointer'
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
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem'
  },
  balancesContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    padding: '36px 12px',
    position: 'relative',
  },
  balances: {
    marginBottom: '-25px',
    marginRight: '30px',
    zIndex: '900',
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
    maxWidth: '900px',
    [theme.breakpoints.up('md')]: {
      width: '750px',
    }
  },
  connectContainer: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
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
    backgroundColor: 'white',
    borderRadius: '3rem',
    border: '1px solid #E1E1E1',
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      padding: '15px',
    }
  },
  tradeContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0px 0px 12px 0px',
    minWidth: '350px',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      padding: '0px 12px 24px 12px',
      minWidth: '350px',
    }
  },
  scaleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 0px 12px 0px',
    alignItems: 'center',
    flexWrap: 'wrap',
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
  },
  footer: {
    position: 'fixed',
    bottom: '30px',
    left: '30px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerText: {
    padding: '10px',
    cursor: 'pointer'
  }
});

class InvestSimple extends Component {

  constructor() {
    super()

    this.state = {
      ethBalance: store.getStore('ethBalance'),
      iEthBalance: store.getStore('iEthBalance'),
      pricePerFullShare: store.getStore('pricePerFullShare'),
      referralLink: '',
      roi: 4,
      account: store.getStore('account'),
      modalOpen: false,
      investModalOpen: false,
      redeemModalOpen: false,
      snackbarType: null,
      snackbarMessage: null,
      amount: '',
      amountError: false,
      redeemAmount: '',
      redeemAmountError: false,
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
    this.setState({ pricePerFullShare: store.getStore('pricePerFullShare') })
  };

  metamaskConnected = () => {
    this.setState({ account: store.getStore('account') })

    dispatcher.dispatch({ type: GET_ETH_BALANCE, content: {} })
    dispatcher.dispatch({ type: GET_IETH_BALANCE, content: {} })

    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: 'Metamask wallet succesfully connected.', snackbarType: 'Info' }
      that.setState(snackbarObj)
    })
  };

  errorReturned = (error) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
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
      amount,
      amountError,
      redeemAmount,
      redeemAmountError,
      referralLink,
      referralLinkError,
      loading,
      ethBalance,
      iEthBalance,
      pricePerFullShare,
      roi,
      account,
      modalOpen,
      investModalOpen,
      redeemModalOpen,
      snackbarMessage
    } = this.state
    console.log(pricePerFullShare);
    console.log(parseFloat(iEthBalance))
    console.log(parseFloat(pricePerFullShare))
    return (
      <div className={ classes.root }>
        <div className={ classes.investedContainer }>
          <div className={ classes.intro }>
            <Typography variant='h2'>Earn interest. Simple.</Typography>
          </div>
          <div className={ classes.balancesContainer }>
            { false && <div className={ classes.overlay } onClick={ this.overlayClicked }>
              <Typography variant='h1' >Connect wallet</Typography>
            </div>}
          </div>

          {!account.address &&
            <div className={ classes.connectContainer }>
              <Button
                className={ classes.actionButton }
                variant="outlined"
                color="primary"
                disabled={ loading }
                onClick={ this.unlockMetamask }
                >
                <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Connect Wallet</Typography>
              </Button>
            </div>
          }

          {account.address && <div className={ classes.actionsContainer }>
            <div className={ classes.tradeContainer }>
              <div className={ classes.balances }>
                  <Typography variant='h3' className={ classes.title }></Typography><Typography variant='h4' onClick={ () => { this.setAmount(100) } } className={ classes.value } noWrap>{ ethBalance ? ethBalance.toFixed(4) : '0.0000' } ETH</Typography>
              </div>
              <div className={ classes.amountContainer }>
                <TextField
                  fullWidth
                  className={ classes.actionInput }
                  id='amount'
                  value={ amount }
                  error={ amountError }
                  onChange={ this.onChange }
                  disabled={ loading }
                  label=""
                  size="small"
                  placeholder="0.00"
                  variant="outlined"
                  onKeyDown={ this.inputKeyDown }
                />
              </div>
              <div className={ classes.scaleContainer }>
                <Button
                  className={ classes.scale }
                  variant='text'
                  disabled={ loading }
                  color="primary"
                  onClick={ () => { this.setAmount(25) } }>
                  <Typography color='secondary'>25%</Typography>
                </Button>
                <Button
                  className={ classes.scale }
                  variant='text'
                  disabled={ loading }
                  color="primary"
                  onClick={ () => { this.setAmount(50) } }>
                  <Typography color='secondary'>50%</Typography>
                </Button>
                <Button
                  className={ classes.scale }
                  variant='text'
                  disabled={ loading }
                  color="primary"
                  onClick={ () => { this.setAmount(75) } }>
                  <Typography color='secondary'>75%</Typography>
                </Button>
                <Button
                  className={ classes.scale }
                  variant='text'
                  disabled={ loading }
                  color="primary"
                  onClick={ () => { this.setAmount(100) } }>
                  <Typography color='secondary'>100%</Typography>
                </Button>
              </div>
              <Button
                className={ classes.actionButton }
                variant="outlined"
                color="primary"
                disabled={ loading || !account.address }
                onClick={ this.onInvest }
                >
                <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Earn</Typography>
              </Button>
            </div>
            <div className={classes.tradeContainer}>
              <div className={ classes.balances }>
                <Typography variant='h3' className={ classes.title }></Typography><Typography variant='h4' onClick={ () => { this.setRedeemAmount(100) } }  className={ classes.value } noWrap>{ iEthBalance ? iEthBalance.toFixed(4) : '0.0000' } iETH ({ iEthBalance ? (parseFloat(iEthBalance)*parseFloat(pricePerFullShare)).toFixed(4) : '0' } ETH)</Typography>
              </div>
              <div className={ classes.amountContainer }>
                <TextField
                  fullWidth
                  className={ classes.actionInput }
                  id='redeemAmount'
                  value={ redeemAmount }
                  error={ redeemAmountError }
                  onChange={ this.onChange }
                  disabled={ loading }
                  label=""
                  placeholder="0.00"
                  variant="outlined"
                  onKeyDown={ this.inputRedeemKeyDown }
                />
              </div>
              <div className={ classes.scaleContainer }>
                <Button
                  className={ classes.scale }
                  variant='text'
                  disabled={ loading }
                  color="primary"
                  onClick={ () => { this.setRedeemAmount(25) } }>
                  <Typography color='secondary'>25%</Typography>
                </Button>
                <Button
                  className={ classes.scale }
                  variant='text'
                  disabled={ loading }
                  color="primary"
                  onClick={ () => { this.setRedeemAmount(50) } }>
                  <Typography color='secondary'>50%</Typography>
                </Button>
                <Button
                  className={ classes.scale }
                  variant='text'
                  disabled={ loading }
                  color="primary"
                  onClick={ () => { this.setRedeemAmount(75) } }>
                  <Typography color='secondary'>75%</Typography>
                </Button>
                <Button
                  className={ classes.scale }
                  variant='text'
                  disabled={ loading }
                  color="primary"
                  onClick={ () => { this.setRedeemAmount(100) } }>
                  <Typography color='secondary'>100%</Typography>
                </Button>
              </div>
              <Button
                className={ classes.actionButton }
                variant="outlined"
                color="primary"
                disabled={ loading || !account.address }
                onClick={ this.onRedeem }
                >
                <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Claim</Typography>
              </Button>
            </div>
          </div>}
        </div>
        <div className={classes.footer}>
          <Typography onClick={()=> window.open("https://docs.iearn.finance", "_blank")} className={ classes.footerText } variant={ 'h6'}>about</Typography>
          <Typography onClick={()=> window.open("https://docs.iearn.finance", "_blank")} className={ classes.footerText } variant={ 'h6'}>docs</Typography>
          <Typography onClick={()=> window.open("https://github.com/iearn-finance", "_blank")} className={ classes.footerText } variant={ 'h6'}>code</Typography>
          <Typography onClick={()=> window.open("https://t.me/iearnfinance", "_blank")} className={ classes.footerText } variant={ 'h6'}>telegram</Typography>
          <Typography onClick={()=> window.open("/apr", "_blank")} className={ classes.footerText } variant={ 'h6'}>yield</Typography>
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

  setAmount = (percent) => {

    if(this.state.loading) {
      return
    }

    const balance = store.getStore('ethBalance')
    let amount = balance*percent/100

    if(percent === 100 && amount > 0.009) {
        amount = amount - 0.009
    }

    this.setState({ amount: amount.toFixed(8) })
  }

  setRedeemAmount = (percent) => {

    if(this.state.loading) {
      return
    }

    const balance = store.getStore('iEthBalance')
    let amount = balance*percent/100

    if(percent === 100 && amount > 0.009) {
        amount = amount - 0.009
    }

    this.setState({ redeemAmount: amount.toFixed(8) })
  }

  onInvest = () => {
    this.setState({ amountError: false })

    const { amount, ethBalance } = this.state

    if(!amount || isNaN(amount) || amount <= 0 || amount > ethBalance) {
      this.setState({ amountError: true })
      return false
    }

    const asset = { iEarnContract: '0x9Dde7cdd09dbed542fC422d18d89A589fA9fD4C0' }

    this.setState({ loading: true })

    dispatcher.dispatch({ type: INVEST, content: { amount: amount, asset: asset } })
  }

  unlockMetamask = () => {
    this.setState({ metamaskLoading: true })
    dispatcher.dispatch({ type: CONNECT_METAMASK, content: {} })
  }

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

  inputRedeemKeyDown = (event) => {
    if (event.which === 13) {
      this.onRedeem();
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

  onRedeem = () => {
    this.setState({ redeemAmountError: false })

    const { redeemAmount, iEthBalance } = this.state

    console.log(iEthBalance);
    console.log(redeemAmount);

    if(!redeemAmount || isNaN(redeemAmount) || redeemAmount <= 0 || redeemAmount > iEthBalance) {
      this.setState({ redeemAmountError: true })
      return false
    }

    const asset = { iEarnContract: '0x9Dde7cdd09dbed542fC422d18d89A589fA9fD4C0' }

    this.setState({ loading: true })

    dispatcher.dispatch({ type: REDEEM, content: { amount: redeemAmount, asset: asset } })
  }
}

export default withRouter(withStyles(styles)(InvestSimple));
