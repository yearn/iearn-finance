import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Button
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';

import {
  ERROR,
  BALANCER_CLAIM,
  BALANCER_CLAIM_RETURNED,
  BALANCER_DEPOSIT,
  BALANCER_DEPOSIT_RETURNED,
  BALANCER_WITHDRAW,
  BALANCER_WITHDRAW_RETURNED
} from '../../constants'

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
    marginBottom: '-25px',
    marginRight: '30px',
    zIndex: '900',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between'
  },
  actionsContainer: {
    paddingBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '100%',
    flexWrap: 'wrap',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      width: '750px',
      padding: '12px',
      flexWrap: 'wrap',
      flexDirection: 'row',
    }
  },
  title: {
    paddingRight: '24px'
  },
  actionButton: {
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '1rem',
    border: '1px solid #E1E1E1',
    fontWeight: 500,
    [theme.breakpoints.up('sm')]: {
      padding: '15px',
    }
  },
  tradeContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 12px 24px 12px',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      padding: '0px 12px 24px 12px',
    }
  },
  sepperator: {
    borderBottom: '1px solid #E1E1E1',
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  scaleContainer: {
    width: '250px',
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
  fullWidth: {
    minWidth: '100%',
    padding: '0px 12px'
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
    emitter.on(BALANCER_DEPOSIT_RETURNED, this.depositReturned);
    emitter.on(BALANCER_WITHDRAW_RETURNED, this.withdrawReturned);
    emitter.on(BALANCER_CLAIM_RETURNED, this.claimReturned);
    emitter.on(ERROR, this.errorReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(BALANCER_DEPOSIT_RETURNED, this.depositReturned);
    emitter.removeListener(BALANCER_WITHDRAW_RETURNED, this.withdrawReturned);
    emitter.removeListener(BALANCER_CLAIM_RETURNED, this.claimReturned);
    emitter.removeListener(ERROR, this.errorReturned);
  };

  depositReturned = () => {
    this.setState({ loading: false, amount: '' })
  };

  withdrawReturned = (txHash) => {
    this.setState({ loading: false, redeemAmount: '' })
  };

  claimReturned = (txHash) => {
    this.setState({ loading: false })
  };

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  render() {
    const { classes, asset, t } = this.props;
    const {
      account,
      amount,
      amountError,
      redeemAmount,
      redeemAmountError,
      loading
    } = this.state

    return (<div className={ classes.actionsContainer }>
      <div className={ classes.tradeContainer }>
        {!asset.disabled && <div className={ classes.balances }>
            <Typography variant='h3' className={ classes.title }></Typography><Typography variant='h4' onClick={ () => { this.setAmount(100) } } className={ classes.value } noWrap>{ 'Balance: '+ (asset.balance ? asset.balance.toFixed(4) : '0.0000') } { asset.tokenSymbol ? asset.tokenSymbol : asset.symbol }</Typography>
        </div>}
        <div className={ classes.amountContainer }>
          <TextField
            fullWidth
            className={ classes.actionInput }
            id='amount'
            value={ amount }
            error={ amountError }
            onChange={ this.onChange }
            disabled={ loading || asset.disabled }
            placeholder="0.00"
            variant="outlined"
            onKeyDown={ this.inputKeyDown }
          />
        </div>
        <div className={ classes.scaleContainer }>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading || asset.disabled }
            color="primary"
            onClick={ () => { this.setAmount(25) } }>
            <Typography variant={'h5'}>25%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading || asset.disabled }
            color="primary"
            onClick={ () => { this.setAmount(50) } }>
            <Typography variant={'h5'}>50%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading || asset.disabled }
            color="primary"
            onClick={ () => { this.setAmount(75) } }>
            <Typography variant={'h5'}>75%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading || asset.disabled }
            color="primary"
            onClick={ () => { this.setAmount(100) } }>
            <Typography variant={'h5'}>100%</Typography>
          </Button>
        </div>
        <Button
          className={ classes.actionButton }
          variant="outlined"
          color="primary"
          disabled={ loading || !account.address || asset.disabled }
          onClick={ this.onDeposit }
          fullWidth
          >
          <Typography className={ classes.buttonText } variant={ 'h5'} color={asset.disabled?'':'secondary'}>{asset.disabled? t('Asset.Disabled'):t('Asset.Deposit')}</Typography>
        </Button>
      </div>
      <div className={ classes.sepperator }></div>
      <div className={classes.tradeContainer}>
        <div className={ classes.balances }>
          <Typography variant='h3' className={ classes.title }></Typography><Typography variant='h4' onClick={ () => { this.setRedeemAmount(100) } }  className={ classes.value } noWrap>{ asset.investedBalance ? asset.investedBalance.toFixed(4) : '0.0000' } { asset.investSymbol } ({ asset.investedBalance ? (parseFloat(asset.investedBalance)*parseFloat(asset.price)).toFixed(4) : '0' }  { asset.tokenSymbol ? asset.tokenSymbol : asset.symbol } )</Typography>
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
        <Button
          className={ classes.actionButton }
          variant="outlined"
          color="primary"
          disabled={ loading || !account.address }
          onClick={ this.onWithdraw }
          fullWidth
          >
          <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>{ t('Asset.Withdraw') }</Typography>
        </Button>
      </div>
      <div className={ classes.sepperator }></div>
      <div className={classes.fullWidth}>
        <Button
          className={ classes.actionButton }
          variant="outlined"
          color="primary"
          disabled={ loading || !account.address }
          onClick={ this.onClaim }
          fullWidth
          >
          <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>{ t('Asset.ClaimRewards') }</Typography>
        </Button>
      </div>
    </div>)
  };

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  inputKeyDown = (event) => {
    if (event.which === 13) {
      this.onDeposit();
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
    dispatcher.dispatch({ type: BALANCER_DEPOSIT, content: { amount: amount, asset: asset } })
  }

  onWithdraw = () => {
    this.setState({ redeemAmountError: false })

    const { redeemAmount } = this.state
    const { asset, startLoading  } = this.props

    if(!redeemAmount || isNaN(redeemAmount) || redeemAmount <= 0 || redeemAmount > asset.investedBalance) {
      this.setState({ redeemAmountError: true })
      return false
    }

    this.setState({ loading: true })
    startLoading()

    dispatcher.dispatch({ type: BALANCER_WITHDRAW, content: { amount: redeemAmount, asset: asset } })
  }

  onClaim = () => {
    const { asset, startLoading  } = this.props

    this.setState({ loading: true })
    startLoading()

    dispatcher.dispatch({ type: BALANCER_CLAIM, content: { asset: asset } })
  }

  setAmount = (percent) => {

    if(this.state.loading) {
      return
    }

    const { asset } = this.props

    const balance = asset.balance
    let amount = balance*percent/100

    if(percent === 100 && asset.symbol === 'ETH') {
        amount = amount - 0.009
    }
    amount = Math.floor(amount*10000)/10000;
    this.setState({ amount: amount.toFixed(4) })
  }

  setRedeemAmount = (percent) => {

    if(this.state.loading) {
      return
    }

    const balance = this.props.asset.investedBalance
    let amount = balance*percent/100
    amount = Math.floor(amount*10000)/10000;

    this.setState({ redeemAmount: amount.toFixed(4) })
  }
}

export default withNamespaces()(withRouter(withStyles(styles, { withTheme: true })(Asset)));
