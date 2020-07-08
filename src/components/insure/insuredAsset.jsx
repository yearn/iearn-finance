import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Button
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import * as moment from 'moment'
import { colors } from '../../theme'

import {
  ERROR,
  BUY_INSURANCE,
  BUY_INSURANCE_RETURNED,
  CLAIM_INSURANCE,
  CLAIM_INSURANCE_RETURNED,
  MINT_INSURANCE,
  MINT_INSURANCE_RETURNED,
  CALCULATE_INSURANCE_COST,
  CALCULATE_INSURANCE_COST_RETURNED,
  GET_ETH_PRICE_RETURNED,
  GET_ETH_BALANCE_RETURNED,
  CALCULATE_MAX_TOKENS,
  CALCULATE_MAX_TOKENS_RETURNED,
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
    flexWrap: 'wrap'
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
  separator: {
    borderBottom: '1px solid #E1E1E1',
    [theme.breakpoints.up('sm')]: {
      width: '40px',
      borderBottom: 'none'
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
    marginTop: '12px'
  },
  tradeContainerCapture: {
    padding: '0px 0px'
  },
  positive: {
    color: colors.green
  },
  warning: {
    color: colors.orange
  },
  error: {
    color: colors.red
  },
  sectionSeparator: {
    borderBottom: '1px solid #DEDEDE',
    minWidth: '100%',
    marginBottom: '36px',
    marginTop: '24px'
  },
  grey: {
    color: colors.darkGray
  },
});


class Asset extends Component {

  constructor() {
    super()

    this.state = {
      amount: '',
      amountError: false,
      ethAmount: '',
      ethAmountError: false,
      account: store.getStore('account'),
      pricePerInsurance: null,
      ethPrice: 0,
      ethBalance: 0,
      maxTokens: 0
    }
  }

  componentWillMount() {
    emitter.on(BUY_INSURANCE_RETURNED, this.buyInsuranceReturned);
    emitter.on(CLAIM_INSURANCE_RETURNED, this.claimInsuranceReturned);
    emitter.on(MINT_INSURANCE_RETURNED, this.mintInsuranceReturned);
    emitter.on(ERROR, this.errorReturned);
    emitter.on(CALCULATE_INSURANCE_COST_RETURNED, this.insuranceCostReturned);
    emitter.on(CALCULATE_MAX_TOKENS_RETURNED, this.calculateMaxTokensReturned);
    emitter.on(GET_ETH_PRICE_RETURNED, this.getEthPriceReturned);
    emitter.on(GET_ETH_BALANCE_RETURNED, this.getEthBalanceReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(BUY_INSURANCE_RETURNED, this.buyInsuranceReturned);
    emitter.removeListener(CLAIM_INSURANCE_RETURNED, this.claimInsuranceReturned);
    emitter.removeListener(MINT_INSURANCE_RETURNED, this.mintInsuranceReturned);
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CALCULATE_INSURANCE_COST_RETURNED, this.insuranceCostReturned);
    emitter.removeListener(CALCULATE_MAX_TOKENS_RETURNED, this.calculateMaxTokensReturned);
    emitter.removeListener(GET_ETH_PRICE_RETURNED, this.getEthPriceReturned);
    emitter.removeListener(GET_ETH_BALANCE_RETURNED, this.getEthBalanceReturned);
  };

  getEthBalanceReturned = (balance) => {
    this.setState({ ethBalance: balance })
  }

  getEthPriceReturned = (price) => {
    this.setState({ ethPrice: price })
  };

  buyInsuranceReturned = () => {
    this.setState({ loading: false, amount: '' })
  };

  claimInsuranceReturned = (txHash) => {
    this.setState({ loading: false })
  };

  mintInsuranceReturned = (txHash) => {
    this.setState({ loading: false, ethAmount: '' })
  };

  insuranceCostReturned = (pricePerInsurance) => {
    this.setState({ pricePerInsurance: pricePerInsurance })
  };

  calculateMaxTokensReturned = (maxTokens) => {
    this.setState({ maxTokens: maxTokens })
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
      ethAmount,
      ethAmountError,
      loading,
      pricePerInsurance,
      ethPrice,
      ethBalance,
      maxTokens
    } = this.state

    let yearlyPremium = 0
    let expectedReturn = 0

    if(pricePerInsurance && pricePerInsurance > 0 && ethPrice && ethPrice > 0) {
      const price = pricePerInsurance * ethPrice
      yearlyPremium = price * 9.125 * 100
      expectedReturn = 20 - yearlyPremium
    }

    return (<div className={ classes.actionsContainer }>
      <div className={ `${classes.tradeContainer} ${classes.tradeContainerCapture}` }>
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
          size="small"
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
          fullWidth
          className={ classes.actionButton }
          variant="outlined"
          color="primary"
          disabled={ loading || !account.address || asset.disabled || expectedReturn <= 10 }
          onClick={ this.onBuy }
          >
          <Typography className={ classes.buttonText } variant={ 'h5'} color={(asset.disabled || expectedReturn <= 10)?'primary':'secondary'}>{(asset.disabled || expectedReturn <= 10)? t('Insure.Disabled'):t('Insure.BuyInsurance')}</Typography>
        </Button>
      </div>
      <div className={ classes.separator }></div>
      <div className={ `${classes.tradeContainer}` }>
        <div className={ classes.tradeContainerInfo }>
          <div className={ classes.infoContainer } >
            <Typography variant={'h3'}>{ t('Insure.TotalCost') }</Typography>
            <Typography variant={'h3'}>{ (amount*(pricePerInsurance !== null ? pricePerInsurance : asset.pricePerInsurance)).toFixed(4) + ' ETH' }</Typography>
          </div>
          <div className={ classes.infoContainer } >
            <Typography variant={'h5'}>{ t('Insure.Expiration') }</Typography>
            <Typography variant={'h4'}>{asset.expiryBlock ? moment(asset.expiryBlock, 'X').fromNow() : t('Insure.Unknown')}</Typography>
          </div>
          <div className={ classes.infoContainer } >
            <Typography variant={'h5'}>{ t('Insure.Premium') }</Typography>
            <Typography variant={'h4'} className={ expectedReturn > 10 ? classes.positive : (expectedReturn > 5 ? classes.warning : classes.error) }>{ '' + (yearlyPremium).toFixed(4) + '%' }</Typography>
          </div>
          <div className={ classes.infoContainer } >
            <Typography variant={'h5'}>{ t('Insure.ExpectedReturns') }</Typography>
            <Typography variant={'h4'} className={ expectedReturn > 10 ? classes.positive : (expectedReturn > 5 ? classes.warning : classes.error) }>{ '' + (expectedReturn).toFixed(4) + '%' }</Typography>
          </div>
        </div>
      </div>
      <div className={ classes.sectionSeparator }></div>
      <div className={ `${classes.tradeContainer} ${classes.tradeContainerCapture}` }>
        {!asset.disabled && <div className={ classes.balances }>
          <Typography variant='h3' className={ classes.title }></Typography><Typography variant='h4' onClick={ () => { this.setEthAmount(100) } } className={ classes.value } noWrap>{ t('Insure.Balance') + (ethBalance ? ethBalance.toFixed(4) : '0.0000') } { 'ETH' }</Typography>
        </div>}
        <TextField
          fullWidth
          className={ classes.actionInput }
          id='ethAmount'
          value={ ethAmount }
          error={ ethAmountError }
          onChange={ this.onChange }
          disabled={ loading || asset.disabled }
          size="small"
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
            onClick={ () => { this.setEthAmount(25) } }>
            <Typography variant={'h5'}>25%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading || asset.disabled }
            color="primary"
            onClick={ () => { this.setEthAmount(50) } }>
            <Typography variant={'h5'}>50%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading || asset.disabled }
            color="primary"
            onClick={ () => { this.setEthAmount(75) } }>
            <Typography variant={'h5'}>75%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading || asset.disabled }
            color="primary"
            onClick={ () => { this.setEthAmount(100) } }>
            <Typography variant={'h5'}>100%</Typography>
          </Button>
        </div>
        <Button
          fullWidth
          className={ classes.actionButton }
          variant="outlined"
          color="primary"
          disabled={ loading || !account.address || asset.disabled }
          onClick={ this.onMint }
          >
          <Typography className={ classes.buttonText } variant={ 'h5'} color={asset.disabled?'primary':'secondary'}>{asset.disabled? t('Insure.Disabled'):t('Insure.MintInsurance')}</Typography>
        </Button>
      </div>
      <div className={ classes.separator }></div>
      <div className={ `${classes.tradeContainer}` }>
        <div className={ classes.tradeContainerInfo }>
          <div className={ classes.infoContainer } >
            <Typography variant={'h3'}>{ t('Insure.TokensMinted') }</Typography>
            <Typography variant={'h3'}>{ maxTokens.toFixed(4) + ' '+asset.insuredSymbol }</Typography>
          </div>
          <div className={ classes.infoContainer } >
            <Typography variant={'h5'}>{ t('Insure.CostPerToken') }</Typography>
            <Typography variant={'h4'}>{ (asset.tokenPrice).toFixed(4) + ' ETH' }</Typography>
          </div>
          <div className={ classes.infoContainer } >
            <Typography variant={'h5'}>{ t('Insure.CollateralizationRatio') }</Typography>
            <Typography variant={'h4'}>{'200%'}</Typography>
          </div>
          <div className={ classes.infoContainer } >
            <Typography variant={'h5'}>{ t('Insure.MinimumCollateralizationRatio') }</Typography>
            <Typography variant={'h4'}>{'160%'}</Typography>
          </div>
        </div>
      </div>
    </div>)
  };

  onChange = (event) => {

    if(event.target.id === 'amount') {
      if(event.target.value === '') {
        this.setState({ pricePerInsurance: 0 })
      } else {
        if(isNaN(event.target.value) || event.target.value < 0) {
          return false
        }

        dispatcher.dispatch({ type: CALCULATE_INSURANCE_COST, content: { amount: event.target.value, asset: this.props.asset } })
      }
    }

    if(event.target.id === 'ethAmount') {
      if(event.target.value === '') {
        this.setState({ maxTokens: 0 })
      } else {
        if(isNaN(event.target.value) || event.target.value < 0) {
          return false
        }

        dispatcher.dispatch({ type: CALCULATE_MAX_TOKENS, content: { amount: event.target.value, asset: this.props.asset } })
      }
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

  onMint = () => {
    this.setState({ ethAmountError: false })

    const { ethAmount, ethBalance } = this.state
    const { asset } = this.props

    if(!ethAmount || isNaN(ethAmount) || ethAmount <= 0 || ethAmount > ethBalance) {
      this.setState({ ethAmountError: true })
      return false
    }

    this.setState({ loading: true })
    dispatcher.dispatch({ type: MINT_INSURANCE, content: { amount: ethAmount, asset: asset } })
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

  setEthAmount = (percent) => {
    if(this.state.loading) {
      return
    }

    const balance = this.state.ethBalance
    let amount = balance*percent/100

    amount = amount*10000/10000;
    this.setState({ ethAmount: amount.toFixed(4) })

    dispatcher.dispatch({ type: CALCULATE_MAX_TOKENS, content: { amount: amount.toFixed(4), asset: this.props.asset } })
  }
}

export default withNamespaces()(withRouter(withStyles(styles, { withTheme: true })(Asset)));
