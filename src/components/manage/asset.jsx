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
  DONATE,
  DONATE_RETURNED,
  REBALANCE,
  REBALANCE_RETURNED,
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
    width: '100%',
    textAlign: 'right',
    paddingRight: '20px',
    cursor: 'pointer'
  },
  actionsContainer: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
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
    borderRadius: '1rem',
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
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    width: '80%',
    padding: '0px 0px 12px 0px',
  },
  text: {
    padding: '4px',
    textAlign: 'right'
  },
  buttonText: {
    fontWeight: '700',
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
});


class Asset extends Component {

  constructor() {
    super()

    this.state = {
      amount: '',
      amountError: false,
      account: store.getStore('account'),
    }
  }

  componentWillMount() {
    emitter.on(DONATE_RETURNED, this.investReturned);
    emitter.on(REBALANCE_RETURNED, this.redeemReturned);
    emitter.on(ERROR, this.errorReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(DONATE_RETURNED, this.investReturned);
    emitter.removeListener(REBALANCE_RETURNED, this.redeemReturned);
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
    const { classes, asset } = this.props;
    const {
      account,
      amount,
      amountError,
      loading
    } = this.state

    return (<div className={ classes.actionsContainer }>
      <div className={ classes.tradeContainer }>
        <div className={ classes.balances }>
            <Typography variant='h3' className={ classes.title }></Typography><Typography variant='h4' onClick={ () => { this.setAmount(100) } } className={ classes.value } noWrap>{ 'Balance: '+ (asset.balance ? asset.balance.toFixed(4) : '0.0000') } { asset.tokenSymbol ? asset.tokenSymbol : asset.symbol }</Typography>
        </div>
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
            <Typography variant={'h5'}>Recommend</Typography>
          </Button>
        </div>
        <div className={ classes.scaleContainer }>
          <Button
            className={ classes.actionButton }
            variant="outlined"
            color="primary"
            disabled={ loading || !account.address }
            onClick={ this.onInvest }
            >
            <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Donate</Typography>
          </Button>
        </div>
      </div>
      <div className={classes.tradeContainer}>
        <div className={ classes.textContainer }>
          <Typography className={ classes.text } variant={ 'h5' }>{ 'Token: ' }</Typography>
          <Typography className={ classes.text } variant={ 'h3' }>{ parseFloat(asset.tokenBalance).toFixed(2) }</Typography>
          <Typography className={ classes.text } variant={ 'h5' }>{ 'Current: ' }</Typography>
          <Typography className={ classes.text } variant={ 'h3' }>{ this.lender(asset.current) }</Typography>
          <Typography className={ classes.text } variant={ 'h5' }>{ 'Recommend: ' }</Typography>
          <Typography className={ classes.text } variant={ 'h3' }>{ this.lender(asset.recommended) }</Typography>
        </div>
        <div className={ classes.scaleContainer }>
          <Button
            className={ classes.actionButton }
            variant="outlined"
            color="primary"
            disabled={ loading || !account.address }
            onClick={ this.onRedeem }
            >
            <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Rebalance</Typography>
          </Button>
        </div>
      </div>
    </div>)
  };

  lender = (val) => {
    if (val === 0) {
      return 'NONE'
    } else if (val === 1) {
      return 'dYdX'
    } else if (val === 2) {
      return 'Compound'
    } else if (val === 3) {
      return 'Aave'
    } else if (val === 4) {
      return 'Fulcrum'
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
    dispatcher.dispatch({ type: DONATE, content: { amount: amount, asset: asset } })
  }

  onRedeem = () => {
    this.setState({ redeemAmountError: false })

    const { asset, startLoading  } = this.props

    this.setState({ loading: true })
    startLoading()

    dispatcher.dispatch({ type: REBALANCE, content: { asset: asset } })
  }

  setAmount = (percent) => {

    if(this.state.loading) {
      return
    }

    const { asset } = this.props

    const balance = asset.balance
    let amount = balance*percent/100

    if (percent === 100) {
      amount = ((asset.poolValue/100)*10)/365;
    }

    this.setState({ amount: amount.toFixed(8) })
  }

  setRedeemAmount = (percent) => {

    if(this.state.loading) {
      return
    }

    const balance = this.props.asset.investedBalance
    let amount = balance*percent/100

    this.setState({ redeemAmount: amount.toFixed(8) })
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(Asset));
