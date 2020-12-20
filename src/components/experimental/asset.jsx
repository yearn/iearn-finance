import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Button
} from '@material-ui/core';

import {
  ERROR,
  DEPOSIT_EXPERIMENTAL_VAULT,
  DEPOSIT_EXPERIMENTAL_VAULT_RETURNED,
  DEPOSIT_ALL_EXPERIMENTAL_VAULT,
  DEPOSIT_ALL_EXPERIMENTAL_VAULT_RETURNED,
  CLAIM_EXPERIMENTAL_VAULT,
  CLAIM_EXPERIMENTAL_VAULT_RETURNED,
  ZAP_EXPERIMENTAL_VAULT,
  ZAP_EXPERIMENTAL_VAULT_RETURNED
} from '../../constants'

import { colors } from '../../theme'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  value: {
    cursor: 'pointer'
  },
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem'
  },
  balances: {
    width: '100%',
    textAlign: 'right',
    paddingRight: '20px',
    cursor: 'pointer'
  },
  vaultContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  actionsContainer: {
    display: 'flex',
    flex: '1',
    padding: '12px 24px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  title: {
    paddingRight: '24px'
  },
  actionButton: {
    height: '47px'
  },
  tradeContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  sepperator: {
    borderBottom: '1px solid #E1E1E1',
    margin: '24px',
    [theme.breakpoints.up('sm')]: {
      width: '40px',
      borderBottom: 'none',
      margin: '0px'
    }
  },
  scaleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 0px 12px 0px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  scale: {
    minWidth: '10px'
  },
  buttonText: {
    fontWeight: '700',
  },
  containedButtonText: {
    fontWeight: '700',
    color: colors.white,
  },
  headingContainer: {
    width: '100%',
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    }
  },
  heading: {
    paddingBottom: '12px',
    flex: 1,
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    }
  },
  right: {
    textAlign: 'right'
  },
  buttons: {
    display: 'flex',
    width: '100%'
  },
  zapButton: {
    display: 'flex',
    width: '100%',
    marginTop: '12px',
    marginBottom: '24px'
  },
  disabledContainer: {
    width: '100%',
    paddingTop: '12px',
    textAlign: 'center'
  },
  assetSummary: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    padding: '12px 24px',
    background: '#dedede',
    width: '100%',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  headingEarning: {
    flex: 1,
    padding: '12px',
  },
  headingStrategy: {
    padding: '12px',
    width: '256px'
  },
  grey: {
    color: colors.darkGray
  },
  flexy: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  fullWidth: {
    minWidth: '100%',
    margin: '18px 0px',
    borderBottom: '1px solid '+colors.borderBlue
  },
  assetSummarySectionheader: {
    width: '83px'
  },
  assetSummaryDescription: {
    flex: 1
  },
  link: {
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  claimableSummary: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: '12px 24px',
    background: '#dedede',
    width: '100%',
    marginBottom: '24px',
    flexWrap: 'wrap',
    borderRadius: '40px'
  },
  claimableAmount: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  claimableAmountValue: {
    marginRight: '6px'
  },
  claimableAmountSymbol: {
    marginBottom: '6px'
  }
});


class Asset extends Component {

  constructor() {
    super()

    this.state = {
      amount: '',
      amountError: false,
      redeemAmount: '',
      redeemAmountError: false,
      account: store.getStore('account'),
    }
  }

  componentWillMount() {
    emitter.on(DEPOSIT_EXPERIMENTAL_VAULT_RETURNED, this.depositReturned);
    emitter.on(CLAIM_EXPERIMENTAL_VAULT_RETURNED, this.claimReturned);
    emitter.on(DEPOSIT_ALL_EXPERIMENTAL_VAULT_RETURNED, this.depositReturned);
    emitter.on(ZAP_EXPERIMENTAL_VAULT_RETURNED, this.zapReturned);
    emitter.on(ERROR, this.errorReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(DEPOSIT_EXPERIMENTAL_VAULT_RETURNED, this.depositReturned);
    emitter.removeListener(CLAIM_EXPERIMENTAL_VAULT_RETURNED, this.claimReturned);
    emitter.removeListener(DEPOSIT_ALL_EXPERIMENTAL_VAULT_RETURNED, this.depositReturned);
    emitter.removeListener(ZAP_EXPERIMENTAL_VAULT_RETURNED, this.zapReturned);
    emitter.removeListener(ERROR, this.errorReturned);
  };

  depositReturned = () => {
    this.setState({ loading: false, amount: '' })
  };

  claimReturned = () => {
    this.setState({ loading: false })
  };

  zapReturned = () => {
    this.setState({ loading: false })
  };

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  render() {
    const { classes, asset } = this.props;
    const {
      amount,
      amountError,
      loading
    } = this.state

    return (
      <div className={ classes.vaultContainer }>
        <div className={ classes.assetSummary }>
          <div className={ classes.assetSummarySectionheader }>
            <Typography variant={ 'h4' } color='primary' noWrap>Warning:</Typography>
          </div>
          <div className={ classes.assetSummaryDescription }>
            <Typography >This vault accepts CRV in exchange for perpetual claim on Curve DAO admin fees across all Yearn products.</Typography>
            <Typography >Since it locks CRV in Curve Voting Escrow for 4 years and regularly prolongs the lock, this vault doesn't have withdrawal functionality.</Typography>
            <Typography variant={ 'h4' }>You will NOT get your CRV back. Ever.</Typography>
          </div>
          <div className={ classes.fullWidth }></div>
          <div className={ classes.assetSummarySectionheader }>
            <Typography variant={ 'h4' } color='primary' noWrap>Balances:</Typography>
          </div>
          <div className={classes.headingEarning}>
            <Typography variant={ 'h5' } className={ classes.grey }>Wallet:</Typography>
            <div className={ classes.flexy }>
              <Typography variant={ 'h4' } noWrap>{ asset.balance ? (asset.balance).toFixed(2) : '0.00' } { asset.symbol }</Typography>
            </div>
          </div>
          <div className={classes.headingEarning}>
            <Typography variant={ 'h5' } className={ classes.grey }>Vested:</Typography>
            <div className={ classes.flexy }>
              <Typography variant={ 'h4' } noWrap>{ asset.vested ? (asset.vested).toFixed(2) : '0.00' } { asset.symbol }</Typography>
            </div>
          </div>
          <div className={classes.headingEarning}>
            <Typography variant={ 'h5' } className={ classes.grey }>Gauges:</Typography>
            <div className={ classes.flexy }>
              <Typography variant={ 'h4' } noWrap>{ asset.gaugeBalance ? (asset.gaugeBalance).toFixed(2) : '0.00' } { asset.symbol }</Typography>
            </div>
          </div>
        </div>
        <div className={ classes.actionsContainer }>
          <div className={ classes.tradeContainer }>
            <div className={ classes.balances }>
                <Typography variant='h4' onClick={ () => { this.setAmount(100) } } className={ classes.value } noWrap>{ 'Your wallet: '+ (asset.balance ? (Math.floor(asset.balance*10000)/10000).toFixed(4) : '0.0000') } { asset.tokenSymbol ? asset.tokenSymbol : asset.symbol }</Typography>
            </div>
            <TextField
              fullWidth
              className={ classes.actionInput }
              id='amount'
              value={ amount }
              error={ amountError }
              onChange={ this.onChange }
              disabled={ loading }
              placeholder="0.00"
              variant="outlined"
              onKeyDown={ this.inputKeyDown }
            />
            <div className={ classes.scaleContainer }>
              <Button
                className={ classes.scale }
                variant='text'
                disabled={ loading }
                color="primary"
                onClick={ () => { this.setAmount(25) } }>
                <Typography variant={'h5'}>25%</Typography>
              </Button>
              <Button
                className={ classes.scale }
                variant='text'
                disabled={ loading }
                color="primary"
                onClick={ () => { this.setAmount(50) } }>
                <Typography variant={'h5'}>50%</Typography>
              </Button>
              <Button
                className={ classes.scale }
                variant='text'
                disabled={ loading }
                color="primary"
                onClick={ () => { this.setAmount(75) } }>
                <Typography variant={'h5'}>75%</Typography>
              </Button>
              <Button
                className={ classes.scale }
                variant='text'
                disabled={ loading }
                color="primary"
                onClick={ () => { this.setAmount(100) } }>
                <Typography variant={'h5'}>100%</Typography>
              </Button>
            </div>
            <div className={ classes.buttons }>
              { asset.deposit === true &&
                <Button
                  className={ classes.actionButton }
                  variant="outlined"
                  color="primary"
                  disabled={ loading || asset.balance <= 0 || asset.depositDisabled === true }
                  onClick={ this.onDeposit }
                  fullWidth
                  >
                  <Typography className={ classes.buttonText } variant={ 'h5'}>Deposit</Typography>
                </Button>
              }
              { asset.depositAll === true &&
                <Button
                  className={ classes.actionButton }
                  variant="outlined"
                  color="primary"
                  disabled={ loading || asset.balance <= 0 || asset.depositDisabled === true }
                  onClick={ this.onDepositAll }
                  fullWidth
                  >
                  <Typography className={ classes.buttonText } variant={ 'h5'}>Deposit All</Typography>
                </Button>
              }
            </div>
          </div>
          <div className={ classes.sepperator }></div>
          <div className={classes.tradeContainer}>
            <div className={ classes.zapButton }>
              <Button
                className={ classes.actionButton }
                variant="outlined"
                color="primary"
                disabled={ loading }
                onClick={ this.onZap }
                fullWidth
                >
                <Typography className={ classes.buttonText } variant={ 'h5'}>Zap All (Wallet/Vested/Gauge)</Typography>
              </Button>
            </div>
            <div className={ classes.buttons }>
              <Button
                className={ classes.actionButton }
                variant="contained"
                color="primary"
                disabled={ loading }
                onClick={ this.onClaim }
                fullWidth
                >
                <Typography className={ classes.containedButtonText } variant={ 'h5'} color='secondary'>Claim Rewards</Typography>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  };

  _getAPY = (asset) => {
    const initialApy = '0.00'

    if (asset.apy) {
      return asset.apy
    } else {
      return initialApy
    }
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

  onDeposit = () => {
    this.setState({ amountError: false })

    const { amount } = this.state
    const { asset, startLoading } = this.props

    if(!amount || isNaN(amount) || amount <= 0 || amount > asset.balance) {
      this.setState({ amountError: true })
      return false
    }

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: DEPOSIT_EXPERIMENTAL_VAULT, content: { amount: amount, asset: asset } })
  }

  onDepositAll = () => {
    const { asset, startLoading } = this.props

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: DEPOSIT_ALL_EXPERIMENTAL_VAULT, content: { asset: asset } })
  }

  onClaim = () => {
    this.setState({ redeemAmountError: false })

    const { asset, startLoading  } = this.props

    this.setState({ loading: true })
    startLoading()

    dispatcher.dispatch({ type: CLAIM_EXPERIMENTAL_VAULT, content: { asset: asset } })
  }

  onZap = () => {
    this.setState({ redeemAmountError: false })

    const { asset, startLoading  } = this.props

    this.setState({ loading: true })
    startLoading()

    dispatcher.dispatch({ type: ZAP_EXPERIMENTAL_VAULT, content: { asset: asset } })
  }

  setAmount = (percent) => {
    if(this.state.loading) {
      return
    }

    const { asset } = this.props

    const balance = asset.balance
    let amount = balance*percent/100
    amount = Math.floor(amount*10000)/10000;

    this.setState({ amount: amount.toFixed(4) })
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(Asset));
