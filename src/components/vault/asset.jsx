import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Button
} from '@material-ui/core';

import WarningIcon from '@material-ui/icons/Warning';

import {
  ERROR,
  DEPOSIT_VAULT,
  DEPOSIT_VAULT_RETURNED,
  WITHDRAW_VAULT,
  WITHDRAW_VAULT_RETURNED,
  DEPOSIT_ALL_VAULT,
  DEPOSIT_ALL_VAULT_RETURNED,
  WITHDRAW_ALL_VAULT,
  WITHDRAW_ALL_VAULT_RETURNED
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
    paddingBottom: '12px',
    display: 'flex',
    flex: '1',
    padding: '24px',
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
  link: {
    cursor: 'pointer',
    textDecoration: 'underline',
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
    emitter.on(DEPOSIT_VAULT_RETURNED, this.depositReturned);
    emitter.on(WITHDRAW_VAULT_RETURNED, this.withdrawReturned);
    emitter.on(DEPOSIT_ALL_VAULT_RETURNED, this.depositReturned);
    emitter.on(WITHDRAW_ALL_VAULT_RETURNED, this.withdrawReturned);
    emitter.on(ERROR, this.errorReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(DEPOSIT_VAULT_RETURNED, this.depositReturned);
    emitter.removeListener(WITHDRAW_VAULT_RETURNED, this.withdrawReturned);
    emitter.removeListener(DEPOSIT_ALL_VAULT_RETURNED, this.depositReturned);
    emitter.removeListener(WITHDRAW_ALL_VAULT_RETURNED, this.withdrawReturned);
    emitter.removeListener(ERROR, this.errorReturned);
  };

  depositReturned = () => {
    this.setState({ loading: false, amount: '' })
  };

  withdrawReturned = (txHash) => {
    this.setState({ loading: false, redeemAmount: '' })
  };

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  render() {
    const { classes, asset } = this.props;
    const {
      amount,
      amountError,
      redeemAmount,
      redeemAmountError,
      loading
    } = this.state

    return (
      <div className={ classes.vaultContainer }>
        <div className={ classes.assetSummary }>
          <div className={ classes.assetSummarySectionheader }>
            <Typography variant={ 'h4' } color='primary' noWrap>Strategy:</Typography>
          </div>
          <div className={classes.headingStrategy}>
            <div>
              <Typography variant={ 'h5' } className={ classes.grey }>Currently Active:</Typography>
              <Typography variant={ 'h4' } noWrap>{ asset.strategyName }</Typography>
            </div>
          </div>
          <div className={classes.headingEarning}>
            <Typography variant={ 'h5' } className={ classes.grey }>Yearly Growth:</Typography>
            <div className={ classes.flexy }>
              <Typography variant={ 'h4' } noWrap>{ (this._getAPY(asset)/1).toFixed(2) }% </Typography>
            </div>
          </div>
          <div className={classes.headingEarning}>
            <Typography variant={ 'h5' } className={ classes.grey }>Monthly Growth:</Typography>
            <div className={ classes.flexy }>
              <Typography variant={ 'h4' } noWrap>{ (this._getAPY(asset)/12).toFixed(2) }% </Typography>
            </div>
          </div>
          <div className={classes.headingEarning}>
            <Typography variant={ 'h5' } className={ classes.grey }>Weekly Growth:</Typography>
            <div className={ classes.flexy }>
              <Typography variant={ 'h4' } noWrap>{ (this._getAPY(asset)/52).toFixed(2) }% </Typography>
            </div>
          </div>
          <div className={ classes.fullWidth }></div>
          <div className={ classes.assetSummarySectionheader }>
            <Typography variant={ 'h4' } color='primary' noWrap>Statistics:</Typography>
          </div>
          <div className={classes.headingEarning}>
            <Typography variant={ 'h5' } className={ classes.grey }>Total Earnings:</Typography>
            <div className={ classes.flexy }>
              <Typography variant={ 'h4' } noWrap>{ asset.addressStatistics ? (asset.addressStatistics.earnings/10**asset.decimals).toFixed(2) : '0.00' } {asset.symbol}</Typography>
            </div>
          </div>
          <div className={classes.headingEarning}>
            <Typography variant={ 'h5' } className={ classes.grey }>Deposits:</Typography>
            <div className={ classes.flexy }>
              <Typography variant={ 'h4' } noWrap>{ asset.addressStatistics ? (asset.addressStatistics.totalDeposits/10**asset.decimals).toFixed(2) : '0.00' } {asset.symbol}</Typography>
            </div>
          </div>
          <div className={classes.headingEarning}>
            <Typography variant={ 'h5' } className={ classes.grey }>Withdrawals:</Typography>
            <div className={ classes.flexy }>
              <Typography variant={ 'h4' } noWrap>{ asset.addressStatistics ? (asset.addressStatistics.totalWithdrawals/10**asset.decimals).toFixed(2) : '0.00' } {asset.symbol}</Typography>
            </div>
          </div>
          <div className={classes.headingEarning}>
            <Typography variant={ 'h5' } className={ classes.grey }>Transferred In:</Typography>
            <div className={ classes.flexy }>
              <Typography variant={ 'h4' } noWrap>{ asset.addressStatistics ? (asset.addressStatistics.totalTransferredIn/10**asset.decimals).toFixed(2) : '0.00' } {asset.symbol}</Typography>
            </div>
          </div>
          <div className={classes.headingEarning}>
            <Typography variant={ 'h5' } className={ classes.grey }>Transferred Out:</Typography>
            <div className={ classes.flexy }>
              <Typography variant={ 'h4' } noWrap>{ asset.addressStatistics ? (asset.addressStatistics.totalTransferredOut/10**asset.decimals).toFixed(2) : '0.00' } {asset.symbol}</Typography>
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
                  <Typography className={ classes.buttonText } variant={ 'h5'} color={asset.disabled?'':'secondary'}>Deposit</Typography>
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
                  <Typography className={ classes.buttonText } variant={ 'h5'} color={asset.disabled?'':'secondary'}>Deposit All</Typography>
                </Button>
              }
            </div>
            { asset.depositDisabled === true &&
              <div className={classes.disabledContainer}>
                <Typography variant='h4'>Deposits are currently disabled for this vault</Typography>
              </div>
            }
          </div>
          <div className={ classes.sepperator }></div>
          <div className={classes.tradeContainer}>
            <div className={ classes.balances }>
              <Typography variant='h4' onClick={ () => { this.setRedeemAmount(100) } }  className={ classes.value } noWrap>{ (asset.vaultBalance ? (Math.floor(asset.vaultBalance*asset.pricePerFullShare*10000)/10000).toFixed(4) : '0.0000') } { asset.symbol } ({ asset.vaultBalance ? (Math.floor(asset.vaultBalance*10000)/10000).toFixed(4) : '0.0000' } { asset.vaultSymbol }) </Typography>
            </div>
            <TextField
              fullWidth
              className={ classes.actionInput }
              id='redeemAmount'
              value={ redeemAmount }
              error={ redeemAmountError }
              onChange={ this.onChange }
              disabled={ loading }
              placeholder="0.00"
              variant="outlined"
              onKeyDown={ this.inputRedeemKeyDown }
            />
            <div className={ classes.scaleContainer }>
              <Button
                className={ classes.scale }
                variant='text'
                disabled={ loading }
                color="primary"
                onClick={ () => { this.setRedeemAmount(25) } }>
                <Typography variant={'h5'}>25%</Typography>
              </Button>
              <Button
                className={ classes.scale }
                variant='text'
                disabled={ loading }
                color="primary"
                onClick={ () => { this.setRedeemAmount(50) } }>
                <Typography variant={'h5'}>50%</Typography>
              </Button>
              <Button
                className={ classes.scale }
                variant='text'
                disabled={ loading }
                color="primary"
                onClick={ () => { this.setRedeemAmount(75) } }>
                <Typography variant={'h5'}>75%</Typography>
              </Button>
              <Button
                className={ classes.scale }
                variant='text'
                disabled={ loading }
                color="primary"
                onClick={ () => { this.setRedeemAmount(100) } }>
                <Typography variant={'h5'}>100%</Typography>
              </Button>
            </div>
            <div className={ classes.buttons }>
              { asset.withdraw === true &&
                <Button
                  className={ classes.actionButton }
                  variant="outlined"
                  color="primary"
                  disabled={ loading || asset.vaultBalance <= 0 }
                  onClick={ this.onWithdraw }
                  fullWidth
                  >
                  <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Withdraw</Typography>
                </Button>
              }
              { asset.withdrawAll === true &&
                <Button
                  className={ classes.actionButton }
                  variant="outlined"
                  color="primary"
                  disabled={ loading || asset.vaultBalance <= 0 }
                  onClick={ this.onWithdrawAll }
                  fullWidth
                  >
                  <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Withdraw All</Typography>
                </Button>
              }
            </div>
            { asset.symbol === 'DAI' &&
              <div className={classes.disabledContainer}>
                <Typography variant='h4'>
                  <WarningIcon fontSize="small" style={{ marginBottom: '-5px' }} />
                  Withdrawals might be subject to high slippage due to recent large <a className={classes.link} href="https://etherscan.io/tx/0x7207d444430344d4d8384d4dd8c12a8a343c9c01ccdb17c8962b84f40955c59f" target="_blank" rel="noopener noreferrer">withdrawal</a>
                </Typography>
              </div>
            }
          </div>
        </div>
      </div>
    )
  };

  _getAPY = (asset) => {
    const { basedOn } = this.props
    const initialApy = '0.00'

    if(asset && asset.stats) {
      switch (basedOn) {
        case 1:
          return asset.stats.apyOneWeekSample || initialApy
        case 2:
          return asset.stats.apyOneMonthSample || initialApy
        case 3:
          return asset.stats.apyInceptionSample || initialApy
        default:
          return asset.apy
      }
    } else if (asset.apy) {
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
    dispatcher.dispatch({ type: DEPOSIT_VAULT, content: { amount: amount, asset: asset } })
  }

  onDepositAll = () => {
    const { asset, startLoading } = this.props

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: DEPOSIT_ALL_VAULT, content: { asset: asset } })
  }

  onWithdraw = () => {
    this.setState({ redeemAmountError: false })

    const { asset, startLoading  } = this.props
    let redeemAmount = this.state.redeemAmount/asset.pricePerFullShare
    redeemAmount = (Math.floor(redeemAmount*10000)/10000).toFixed(4);

    if(!redeemAmount || isNaN(redeemAmount) || redeemAmount <= 0 || redeemAmount > asset.vaultBalance) {
      this.setState({ redeemAmountError: true })
      return false
    }

    this.setState({ loading: true })
    startLoading()

    dispatcher.dispatch({ type: WITHDRAW_VAULT, content: { amount: redeemAmount, asset: asset } })
  }

  onWithdrawAll = () => {
    const { asset, startLoading } = this.props

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: WITHDRAW_ALL_VAULT, content: { asset: asset } })
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

  setRedeemAmount = (percent) => {
    if(this.state.loading) {
      return
    }

    const balance = this.props.asset.vaultBalance*this.props.asset.pricePerFullShare
    let amount = balance*percent/100
    amount = Math.floor(amount*10000)/10000;

    this.setState({ redeemAmount: amount.toFixed(4) })
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(Asset));

