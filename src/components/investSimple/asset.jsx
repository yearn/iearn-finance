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
  INVEST,
  INVEST_RETURNED,
  REDEEM,
  REDEEM_RETURNED,
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
    width: '100%',
    textAlign: 'right',
    paddingRight: '20px',
    cursor: 'pointer'
  },
  actionsContainer: {
    paddingBottom: '12px',
    display: 'flex',
    flex: '1',
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
    emitter.on(INVEST_RETURNED, this.investReturned);
    emitter.on(REDEEM_RETURNED, this.redeemReturned);
    emitter.on(ERROR, this.errorReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(INVEST_RETURNED, this.investReturned);
    emitter.removeListener(REDEEM_RETURNED, this.redeemReturned);
    emitter.removeListener(ERROR, this.errorReturned);
  };

  investReturned = () => {
    this.setState({ loading: false, amount: '' })
  };

  redeemReturned = (txHash) => {
    this.setState({ loading: false, redeemAmount: '' })
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
          onClick={ this.onInvest }
          fullWidth
          >
          <Typography className={ classes.buttonText } variant={ 'h5'} color={asset.disabled?'':'secondary'}>{asset.disabled? t('Asset.Disabled'):t('Asset.Earn')}</Typography>
        </Button>
      </div>
      <div className={ classes.sepperator }></div>
      <div className={classes.tradeContainer}>
        <div className={ classes.balances }>
          <Typography variant='h3' className={ classes.title }></Typography><Typography variant='h4' onClick={ () => { this.setRedeemAmount(100) } }  className={ classes.value } noWrap>{ asset.investedBalance ? asset.investedBalance.toFixed(4) : '0.0000' } { asset.investSymbol } ({ asset.investedBalance ? (parseFloat(asset.investedBalance)*parseFloat(asset.price)).toFixed(4) : '0' }  { asset.tokenSymbol ? asset.tokenSymbol : asset.symbol } )</Typography>
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
        <Button
          className={ classes.actionButton }
          variant="outlined"
          color="primary"
          disabled={ loading || !account.address }
          onClick={ this.onRedeem }
          fullWidth
          >
          <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>{ t('Asset.Claim') }</Typography>
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
      this.onInvest();
    }
  }

  onInvest = () => {
    this.setState({ amountError: false })

    const { amount } = this.state
    const { asset, startLoading } = this.props

    if(!amount || isNaN(amount) || amount <= 0 || amount > asset.balance) {
      this.setState({ amountError: true })
      return false
    }

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: INVEST, content: { amount: amount, asset: asset } })
  }

  onRedeem = () => {
    this.setState({ redeemAmountError: false })

    const { redeemAmount } = this.state
    const { asset, startLoading  } = this.props

    if(!redeemAmount || isNaN(redeemAmount) || redeemAmount <= 0 || redeemAmount > asset.investedBalance) {
      this.setState({ redeemAmountError: true })
      return false
    }

    this.setState({ loading: true })
    startLoading()

    dispatcher.dispatch({ type: REDEEM, content: { amount: redeemAmount, asset: asset } })
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
