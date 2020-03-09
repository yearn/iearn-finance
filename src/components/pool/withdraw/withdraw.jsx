import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  Typography,
  Button,
  InputAdornment,
  TextField
} from '@material-ui/core';

import Loader from '../../loader'
import UnlockModal from '../../unlock/unlockModal.jsx'
import Snackbar from '../../snackbar'

import {
  ERROR,
  GET_POOL_BALANCES,
  POOL_BALANCES_RETURNED,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  WITHDRAW_POOL,
  WITHDRAW_POOL_RETURNED
} from '../../../constants'

import { withNamespaces } from 'react-i18next';
import Store from "../../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1200px',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  intro: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '400px'
  },
  introCenter: {
    minWidth: '100%',
    textAlign: 'center',
    padding: '48px 0px'
  },
  investedContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    minWidth: '100%',
    [theme.breakpoints.up('md')]: {
      minWidth: '800px',
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
  disaclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    marginBottom: '24px',
  },
  addressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '100px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    textOverflow:'ellipsis',
    cursor: 'pointer',
    padding: '10px',
    borderRadius: '0.75rem',
    height: 'max-content',
    [theme.breakpoints.up('md')]: {
      maxWidth: '130px',
      width: '100%'
    }
  },
  card: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '400px',
    justifyContent: 'center',
    padding: '12px',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    padding: '12px',
    borderRadius: '1.25em',
    justifyContent: 'center',
    marginTop: '20px',
    [theme.breakpoints.up('md')]: {
      padding: '24px',
    }
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
  title: {
    paddingRight: '24px'
  },
  value: {
    cursor: 'pointer'
  },
  valContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: '100%'
  },
  inputCardHeading: {
    width: '100%',
    padding: '12px 0px 12px 20px'
  },
});

class Withdraw extends Component {

  constructor() {
    super()

    const account = store.getStore('account')

    this.state = {
      account: account,
      assets: store.getStore('poolAssets')
    }

    if(account && account.address) {
      dispatcher.dispatch({ type: GET_POOL_BALANCES, content: {} })
    }
  }

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(POOL_BALANCES_RETURNED, this.balancesReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(WITHDRAW_POOL_RETURNED, this.withdrawPoolReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(POOL_BALANCES_RETURNED, this.balancesReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(WITHDRAW_POOL_RETURNED, this.withdrawPoolReturned);
  };

  withdrawPoolReturned  = (txHash) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  };

  balancesReturned = (balances) => {
    this.setState({ assets: store.getStore('poolAssets') })

    this.setDefaultValues(store.getStore('poolAssets'))
  };

  setDefaultValues = (assets) => {
    let that = this

    assets.map((asset) => {
      switch (asset.id) {
        case 'DAI':
          that.setState({ daiAmount: asset.investedBalance.toFixed(4) })
          break;
        case 'USDC':
          that.setState({ usdcAmount: asset.investedBalance.toFixed(4) })
          break;
        case 'USDT':
          that.setState({ usdtAmount: asset.investedBalance.toFixed(4) })
          break;
        case 'TUSD':
          that.setState({ tusdAmount: asset.investedBalance.toFixed(4) })
          break;
        case 'SUSD':
          that.setState({ susdAmount: asset.investedBalance.toFixed(4) })
          break;
        default:
      }
    })
  }

  refresh() {
    dispatcher.dispatch({ type: GET_POOL_BALANCES, content: {} })
  }

  connectionConnected = () => {
    const { t } = this.props

    this.setState({ account: store.getStore('account') })

    dispatcher.dispatch({ type: GET_POOL_BALANCES, content: {} })

    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: t("Unlock.WalletConnected"), snackbarType: 'Info' }
      that.setState(snackbarObj)
    })
  };

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account') })
  }

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

  render() {
    const { classes, t } = this.props;
    const {
      account,
      loading,
      modalOpen,
      snackbarMessage,
      daiAmount,
      usdcAmount,
      usdtAmount,
      tusdAmount,
      susdAmount,
      amount
    } = this.state

    var address = null;
    if (account.address) {
      address = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }

    return (
      <div className={ classes.root }>
        { !account.address &&
          <div className={ classes.investedContainer }>
            <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>
            <div className={ classes.introCenter }>
              <Typography variant='h2'>{ t('PoolWithdraw.Intro') }</Typography>
            </div>
            <div className={ classes.connectContainer }>
              <Button
                className={ classes.actionButton }
                variant="outlined"
                color="primary"
                disabled={ loading }
                onClick={ this.overlayClicked }
                >
                <Typography className={ classes.buttonText } variant={ 'h5'}>{ t('PoolWithdraw.Connect') }</Typography>
              </Button>
            </div>
          </div>
        }
        { account.address &&
          <div className={ classes.card }>
            <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>
            <div className={ classes.intro }>
              <Typography variant='h2' className={ classes.introText }>{ t('PoolWithdraw.Intro') }</Typography>
              <Card className={ classes.addressContainer } onClick={this.overlayClicked}>
                <Typography variant={ 'h5'} noWrap>{ address }</Typography>
                <div style={{ background: '#DC6BE5', opacity: '1', borderRadius: '10px', width: '10px', height: '10px', marginRight: '3px', marginTop:'3px', marginLeft:'6px' }}></div>
              </Card>
            </div>
            <Card className={ classes.inputContainer }>
              <Typography variant='h3' className={ classes.inputCardHeading }>{ t("PoolWithdraw.Withdraw") }</Typography>
              { this.renderAmountInput('amount', amount, false, 'CRV', '0.00', 'CRV', false) }
              <Typography variant='h3' className={ classes.inputCardHeading }>{ t("PoolWithdraw.IWillReceive") }</Typography>
              { this.renderAmountInput('daiAmount', daiAmount, false, 'DAI', '0.00', 'DAI', true) }
              { this.renderAmountInput('usdcAmount', usdcAmount, false, 'USDC', '0.00', 'USDC', true) }
              { this.renderAmountInput('usdtAmount', usdtAmount, false, 'USDT', '0.00', 'USDT', true) }
              { this.renderAmountInput('tusdAmount', tusdAmount, false, 'TUSD', '0.00', 'TUSD', true) }
              { this.renderAmountInput('susdAmount', susdAmount, false, 'SUSD', '0.00', 'SUSD', true) }
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
            </Card>
          </div>
        }
        { modalOpen && this.renderModal() }
        { snackbarMessage && this.renderSnackbar() }
        { loading && <Loader /> }
      </div>
    )
  };

  onWithdraw = () => {
    this.setState({ amountError: false })

    const { amount } = this.state

    // if(!amount || isNaN(amount) || amount <= 0 || amount > asset.balance) {
    //   this.setState({ amountError: true })
    //   return false
    // }

    this.setState({ loading: true })
    dispatcher.dispatch({ type: WITHDRAW_POOL, content: { amount: amount } })
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  onChange = (event) => {
    let val = []
    val[event.target.name] = event.target.value
    this.setState(val)
  };

  renderAmountInput = (id, value, error, label, placeholder, inputAdornment, disabled) => {
    const { classes, loading } = this.props
    const { assets } =  this.state

    const sendAsset = assets.filter((asset) => { return asset.id === inputAdornment })[0]

    return (
      <div className={ classes.valContainer }>
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
              endAdornment: <InputAdornment position="end" className={ classes.inputAdornment }><Typography variant='h3'>{ inputAdornment }</Typography></InputAdornment>,
              startAdornment: <InputAdornment position="end" className={ classes.inputAdornment }>
                <div className={ classes.assetIcon }>
                  <img
                    alt=""
                    src={ require('../../../assets/'+inputAdornment+'-logo.png') }
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

  setAmount(id, balance) {
    let val = []
    val[id] = balance.toFixed(4)
    this.setState(val)
  }

}

export default withNamespaces()(withRouter(withStyles(styles)(Withdraw)));
