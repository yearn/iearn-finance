import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Button,
  InputAdornment
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';

import {
  ERROR,
  BALANCER_POOL_JOIN,
  BALANCER_POOL_JOIN_RETURNED,
  BALANCER_POOL_EXIT,
  BALANCER_POOL_EXIT_RETURNED,
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
      flexWrap: 'wrap',
      flexDirection: 'row',
    }
  },
  title: {
    paddingRight: '24px'
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
  actionButton: {
    '&:hover': {
      backgroundColor: "#2F80ED",
    },
    padding: '12px',
    backgroundColor: "#2F80ED",
    borderRadius: '1rem',
    border: '1px solid #E1E1E1',
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      padding: '15px',
    }
  },
  buttonText: {
    fontWeight: '700',
    color: 'white',
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
  },
  valContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem'
  },
  inputAdornment: {
    fontWeight: '600',
    fontSize: '1.5rem'
  },
  assetIcon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    borderRadius: '25px',
    background: '#dedede',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    marginRight: '16px'
  },
  balances: {
    marginTop: '9px',
    marginBottom: '-23px',
    marginRight: '30px',
    paddingRight: '14px',
    zIndex: '900',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between'
  },
  inputCardHeading: {
    width: '100%',
    padding: '12px 0px 12px 20px'
  },
  halfhalf: {
    flex: 1,
    padding: '0px 12px'
  }
});


class Asset extends Component {

  constructor(props) {
    super()

    const { pool, assets } = props

    this.state = {
      amount: '',
      amountError: false,
      redeemAmount: '',
      redeemAmountError: false,
      account: store.getStore('account'),
      assets: assets.filter((asset) => { return pool.assets.includes(asset.id) }),
      pool: pool
    }
  }

  componentWillMount() {
    emitter.on(BALANCER_POOL_JOIN_RETURNED, this.joinPoolReturned);
    emitter.on(BALANCER_POOL_EXIT_RETURNED, this.exitPoolReturned);
    emitter.on(ERROR, this.errorReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(BALANCER_POOL_JOIN_RETURNED, this.joinPoolReturned);
    emitter.removeListener(BALANCER_POOL_EXIT_RETURNED, this.exitPoolReturned);
    emitter.removeListener(ERROR, this.errorReturned);
  };

  joinPoolReturned = () => {
    this.setState({ loading: false, amount: '' })
  };

  exitPoolReturned = (txHash) => {
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
      { this.renderDeposit() }
      { this.renderWithdraw() }
    </div>)
  };

  renderDeposit = () => {
    const { classes, t } = this.props
    const { assets, pool, loading } = this.state
    const st = this.state
    return (
      <div className={ classes.halfhalf }>
        <Typography variant='h3' className={ classes.inputCardHeading }>{ t("PoolDeposit.Deposit") }</Typography>
        {
          assets.map((asset) => {
            return this.renderAmountInput(pool.id+'_'+asset.id, st[pool.id+'_'+asset.id+'_value'], st[pool.id+'_'+asset.id+'_error'], asset.name, '0.00', asset.investSymbol, false, false, false, asset)
          })
        }
        <Button
          className={ classes.actionButton }
          variant="outlined"
          color="primary"
          disabled={ loading }
          onClick={ this.onDeposit }
          fullWidth
          >
          <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>{ t('PoolDeposit.Deposit') }</Typography>
        </Button>
      </div>
    )
  }

  renderWithdraw = () => {
    const { classes, t } = this.props
    const { assets, pool, loading } = this.state
    const st = this.state
    return (
      <div className={ classes.halfhalf }>
        <Typography variant='h3' className={ classes.inputCardHeading }>{ t("PoolWithdraw.Withdraw") }</Typography>
        {
          assets.map((asset) => {
            return this.renderAmountInput(pool.id+'_'+asset.id, st[pool.id+'_'+asset.id+'_value'], st[pool.id+'_'+asset.id+'_error'], asset.name, '0.00', asset.investSymbol, false, false, false, asset)
          })
        }
        <Button
          className={ classes.actionButton }
          variant="outlined"
          color="primary"
          disabled={ loading }
          onClick={ this.onWithdraw }
          fullWidth
          >
          <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>{ t('PoolWithdraw.Withdraw') }</Typography>
        </Button>
      </div>
    )
  }

  renderAmountInput = (id, value, error, label, placeholder, inputAdornment, disabled, hideBalance, disabledAdornment, sendAsset) => {
    const { classes, loading } = this.props

    return (
      <div className={ classes.valContainer }>
        <div className={ classes.balances }>
          <Typography variant='h3' className={ classes.title }> </Typography>
          <Typography variant='h4' onClick={ () => { if(hideBalance) { return; } this.setAmount(id, (sendAsset ? sendAsset.investedBalance : 0)) } } className={ classes.value } noWrap>{ !hideBalance ? ('Balance: '+ ( sendAsset && sendAsset.investedBalance ? (Math.floor(sendAsset.investedBalance*10000)/10000).toFixed(4) : '0.0000')) : '' } { !hideBalance ? (sendAsset ? sendAsset.investSymbol : '') : '' }</Typography>
          { hideBalance && <div className={ classes.placceholder }></div> }
        </div>
        <div>
          <TextField
            fullWidth
            className={ classes.actionInput }
            id={ id }
            name={ id }
            value={ value }
            error={ error }
            onChange={ this.onChange }
            disabled={ loading || disabled }
            placeholder={ placeholder }
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end" className={ classes.inputAdornment }><Typography variant='h3' className={ disabledAdornment ? classes.disabledAdornment : '' }>{ inputAdornment }</Typography></InputAdornment>,
              startAdornment: <InputAdornment position="end" className={ classes.inputAdornment }>
                <div className={ classes.assetIcon }>
                  <img
                    alt=""
                    src={ require('../../assets/'+inputAdornment+'-logo.png') }
                    height="30px"
                  />
                </div>
              </InputAdornment>,
            }}
          />
        </div>
      </div>
    )
  }

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
    const { startLoading  } = this.props

    const { pool, assets } = this.state
    const st = this.state

    let sendAssets = assets.map((asset) => {
      asset.amount = st[pool.id+'_'+asset.id+'_value']
      return asset
    })

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: BALANCER_POOL_JOIN, content: { assets: sendAssets } })
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

    dispatcher.dispatch({ type: BALANCER_POOL_EXIT, content: { amount: redeemAmount, asset: asset } })
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

    const balance = this.props.asset.investedBalance
    let amount = balance*percent/100
    amount = Math.floor(amount*10000)/10000;

    this.setState({ redeemAmount: amount.toFixed(4) })
  }
}

export default withNamespaces()(withRouter(withStyles(styles, { withTheme: true })(Asset)));
