import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Slide,
  Typography,
  TextField,
  Button
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import * as moment from 'moment'
import { colors } from '../../theme'

import {
  ERROR,
  INSURANCE_BALANCES,
  INSURANCE_BALANCES_RETURNED,
  BUY_INSURANCE,
  BUY_INSURANCE_RETURNED,
  CLAIM_INSURANCE,
  CLAIM_INSURANCE_RETURNED,
  CALCULATE_INSURANCE_COST,
  CALCULATE_INSURANCE_COST_RETURNED,
  GET_ETH_PRICE_RETURNED,
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
      flexWrap: 'nowrap',
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
    flexWrap: 'wrap',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    }
  },
  heading: {
    paddingBottom: '12px',
    flex: 1,
    flexShrink: 0,
    minWidth: '50%',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    }
  },
  right: {
    textAlign: 'right'
  },
  infoContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '12px'
  },
  tradeContainerInfo: {
    background: '#efefef',
    padding: '18px 18px 6px 18px',
    borderRadius: '1.25em',
    width: '100%',
    marginBottom: '12px',
    [theme.breakpoints.up('sm')]: {
      marginLeft: '24px',
    }
  },
  tradeContainerCapture: {
    padding: '12px 0px'
  },
  positive: {
    color: colors.green
  },
  warning: {
    color: colors.orange
  },
  error: {
    color: colors.red
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
      pricePerInsurance: null,
      ethPrice: 0
    }
  }

  componentWillMount() {
    emitter.on(BUY_INSURANCE_RETURNED, this.buyInsuranceReturned);
    emitter.on(CLAIM_INSURANCE_RETURNED, this.claimInsuranceReturned);
    emitter.on(ERROR, this.errorReturned);
    emitter.on(CALCULATE_INSURANCE_COST_RETURNED, this.insuranceCostReturned);
    emitter.on(GET_ETH_PRICE_RETURNED, this.getEthPriceReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(BUY_INSURANCE_RETURNED, this.buyInsuranceReturned);
    emitter.removeListener(CLAIM_INSURANCE_RETURNED, this.claimInsuranceReturned);
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CALCULATE_INSURANCE_COST_RETURNED, this.insuranceCostReturned);
    emitter.removeListener(GET_ETH_PRICE_RETURNED, this.getEthPriceReturned);
  };

  getEthPriceReturned = (price) => {
    this.setState({ ethPrice: price })
  };

  buyInsuranceReturned = () => {
    this.setState({ loading: false, amount: '' })
  };

  claimInsuranceReturned = (txHash) => {
    this.setState({ loading: false })
  };

  insuranceCostReturned = (pricePerInsurance) => {
    this.setState({ pricePerInsurance: pricePerInsurance })
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
      loading,
      pricePerInsurance,
      ethPrice
    } = this.state

    let yearlyPremium = 0
    let expectedReturn = 0

    if(pricePerInsurance && pricePerInsurance > 0 && ethPrice && ethPrice > 0) {
      const price = pricePerInsurance * ethPrice
      yearlyPremium = price * 9.125 * 100
      expectedReturn = 20 - yearlyPremium
    }

    return (<div className={ classes.actionsContainer }>
      <div className={ classes.headingContainer }>
        <div className={classes.heading}>
          <Typography variant={ 'h3' }>{ ( asset.balance ? (asset.balance).toFixed(4) : '0.0000')+' '+( asset.tokenSymbol ? asset.tokenSymbol : asset.symbol ) }</Typography>
          <Typography variant={ 'h5' }>{ t('Insure.Balance') }</Typography>
        </div>
        <div className={`${classes.heading} ${classes.right}`}>
          <Typography variant={ 'h3' }>{ (asset.balance > 0 ? (asset.insuredBalance  * 100 / (asset.insuredBalance + asset.balance)).toFixed(4) : '0.0000')+' %'}</Typography>
          <Typography variant={ 'h5' }>{ t('Insure.Insured') }</Typography>
        </div>
        <div className={classes.heading}>
          <Typography variant={ 'h3' }>{ (asset.maxApr*100).toFixed(4)+' %'}</Typography>
          <Typography variant={ 'h5' }>{ t('Insure.UninsuredYield') }</Typography>
        </div>
        <div className={`${classes.heading} ${classes.right}`}>
          <Typography variant={ 'h3' }>{ (asset.insuredApr*100).toFixed(4)+' %'}</Typography>
          <Typography variant={ 'h5' }>{ t('Insure.InsuredYield') }</Typography>
        </div>
      </div>
      <div className={ `${classes.tradeContainer} ${classes.tradeContainerCapture}` }>
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
          disabled={ loading || !account.address || asset.disabled || expectedReturn <= 0 }
          onClick={ this.onBuy }
          >
          <Typography className={ classes.buttonText } variant={ 'h5'} color={asset.disabled?'':'secondary'}>{asset.disabled? t('Insure.Disabled'):t('Insure.BuyInsurance')}</Typography>
        </Button>
      </div>
      <div className={ classes.sepperator }></div>
      <div className={ `${classes.tradeContainer}` }>
        <div className={ classes.tradeContainerInfo }>
          <div className={ classes.infoContainer } >
            <Typography variant={'h3'}>Total Cost</Typography>
            <Typography variant={'h3'}>{ (amount*(pricePerInsurance !== null ? pricePerInsurance : asset.pricePerInsurance)).toFixed(4) + ' ETH' }</Typography>
          </div>
          <div className={ classes.infoContainer } >
            <Typography variant={'h5'}>Duration</Typography>
            <Typography variant={'h4'}>{asset.expiryBlock ? moment(asset.expiryBlock, 'X').fromNow() : 'Unknown'}</Typography>
          </div>
          <div className={ classes.infoContainer } >
            <Typography variant={'h5'}>Premium</Typography>
            <Typography variant={'h4'} className={ expectedReturn > 10 ? classes.positive : (expectedReturn > 5 ? classes.warning : classes.error) }>{ '' + (yearlyPremium).toFixed(4) + '%' }</Typography>
          </div>
          <div className={ classes.infoContainer } >
            <Typography variant={'h5'}>Expected Returns</Typography>
            <Typography variant={'h4'} className={ expectedReturn > 10 ? classes.positive : (expectedReturn > 5 ? classes.warning : classes.error) }>{ '' + (expectedReturn).toFixed(4) + '%' }</Typography>
          </div>
        </div>
        <Button
          className={ classes.actionButton }
          variant="outlined"
          color="primary"
          disabled={ true || loading || !account.address || asset.disabled }
          onClick={ this.onClaim }
          >
          <Typography className={ classes.buttonText } variant={ 'h5'} color={asset.disabled?'':'secondary'}>{asset.disabled? t('Insure.Disabled'):t('Insure.ClaimInsurance')}</Typography>
        </Button>
      </div>
    </div>)
  };

  onChange = (event) => {

    if(event.target.id === 'amount') {
      if(isNaN(event.target.value) || event.target.value <= 0) {
        return false
      }

      dispatcher.dispatch({ type: CALCULATE_INSURANCE_COST, content: { amount: event.target.value, asset: this.props.asset } })
    }

    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  inputKeyDown = (event) => {
    if (event.which === 13) {
      this.onInvest();
    }
  }

  onBuy = () => {
    this.setState({ amountError: false })

    const { amount } = this.state
    const { asset } = this.props

    if(!amount || isNaN(amount) || amount <= 0 || amount > asset.balance) {
      this.setState({ amountError: true })
      return false
    }

    this.setState({ loading: true })
    dispatcher.dispatch({ type: BUY_INSURANCE, content: { amount: amount, asset: asset } })
  }

  onClaim = () => {
    this.setState({ redeemAmountError: false })

    const { redeemAmount } = this.state
    const { asset  } = this.props

    if(!redeemAmount || isNaN(redeemAmount) || redeemAmount <= 0 || redeemAmount > asset.investedBalance) {
      this.setState({ redeemAmountError: true })
      return false
    }

    this.setState({ loading: true })
    dispatcher.dispatch({ type: CLAIM_INSURANCE, content: { amount: redeemAmount, asset: asset } })
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
    amount = Math.floor(amount*10000/10000);
    this.setState({ amount: amount.toFixed(0) })

    dispatcher.dispatch({ type: CALCULATE_INSURANCE_COST, content: { amount: amount.toFixed(0), asset: this.props.asset } })
  }
}

export default withNamespaces()(withRouter(withStyles(styles, { withTheme: true })(Asset)));
