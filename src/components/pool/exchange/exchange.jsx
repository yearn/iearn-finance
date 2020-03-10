import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  Typography,
  Button,
  InputAdornment,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@material-ui/core';

import Loader from '../../loader'
import Snackbar from '../../snackbar'

import {
  ERROR,
  GET_POOL_BALANCES,
  POOL_BALANCES_RETURNED,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  GET_EXCHANGE_PRICE,
  EXCHANGE_PRICE_RETURNED,
  EXCHANGE_POOL,
  EXCHANGE_POOL_RETURNED
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
    maxWidth: '800px'
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
    maxWidth: '800px',
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
    justifyContent: 'flex-start',
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
  },
  inputCardHeading: {
    width: '100%',
    padding: '12px 0px 12px 20px'
  },
  radioGroup: {
    padding: '12px 0px 24px 20px'
  },
  sepperator: {
    borderRight: '1px solid #DEDEDE',
    margin: '12px 24px 24px 24px'
  },
  sendContainer: {
    flex: 1,
  },
  receiveContainer:  {
    flex: 1,
  }
});

class Exchange extends Component {

  constructor() {
    super()

    const account = store.getStore('account')

    this.state = {
      account: account,
      assets: store.getStore('poolAssets'),
      sendAsset: 'DAI',
      receiveAsset: 'USDC'
    }

    if(account && account.address) {
      dispatcher.dispatch({ type: GET_POOL_BALANCES, content: {} })
    }
  }

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(POOL_BALANCES_RETURNED, this.balancesReturned);
    emitter.on(EXCHANGE_PRICE_RETURNED, this.exchangePriceReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(EXCHANGE_POOL_RETURNED, this.exchangePoolReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(POOL_BALANCES_RETURNED, this.balancesReturned);
    emitter.removeListener(EXCHANGE_PRICE_RETURNED, this.exchangePriceReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(EXCHANGE_POOL_RETURNED, this.exchangePoolReturned);
  };

  exchangePoolReturned  = (txHash) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  };

  exchangePriceReturned = (price) => {
    console.log(price)
    this.setState({ receiveAmount: price ? parseFloat(price).toFixed(4) : '0.0000' })
  };

  balancesReturned = (balances) => {
    this.setState({ assets: store.getStore('poolAssets') })
  };

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
      snackbarMessage,
      sendAmount,
      sendAsset,
      receiveAmount,
      receiveAsset,
    } = this.state

    var address = null;
    if (account.address) {
      address = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }


    return (
      <div className={ classes.root }>
        <div className={ classes.card }>
          <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>
          <div className={ classes.intro }>
            <Typography variant='h2' className={ classes.introText }>{ t('PoolExchange.Intro') }</Typography>
            <Card className={ classes.addressContainer } onClick={this.overlayClicked}>
              <Typography variant={ 'h5'} noWrap>{ address }</Typography>
              <div style={{ background: '#DC6BE5', opacity: '1', borderRadius: '10px', width: '10px', height: '10px', marginRight: '3px', marginTop:'3px', marginLeft:'6px' }}></div>
            </Card>
          </div>
          <Card className={ classes.inputContainer }>
            <div className={ classes.sendContainer }>
              <Typography variant='h3' className={ classes.inputCardHeading }>{ t("PoolExchange.From") }</Typography>
              { this.renderAmountInput('sendAmount', sendAmount, false, 'DAI', '0.00') }
              <RadioGroup className={ classes.radioGroup } name="sendAsset" value={sendAsset} onChange={ this.handleChange }>
                <FormControlLabel value="DAI" control={<Radio />} label="DAI" />
                <FormControlLabel value="USDC" control={<Radio />} label="USDC" />
                <FormControlLabel value="USDT" control={<Radio />} label="USDT" />
                <FormControlLabel value="TUSD" control={<Radio />} label="TUSD" />
                <FormControlLabel value="SUSD" control={<Radio />} label="SUSD" />
              </RadioGroup>
            </div>
            <div className={ classes.sepperator }>

            </div>
              <div className={ classes.receiveContainer }>
              <Typography variant='h3' className={ classes.inputCardHeading }>{ t("PoolExchange.To") }</Typography>
              { this.renderAmountInput('daiAmount', receiveAmount, false, 'DAI', '0.00', true) }
              <RadioGroup className={ classes.radioGroup } name="receiveAsset" value={receiveAsset} onChange={ this.handleChange }>
                <FormControlLabel value="DAI" control={<Radio />} label="DAI" />
                <FormControlLabel value="USDC" control={<Radio />} label="USDC" />
                <FormControlLabel value="USDT" control={<Radio />} label="USDT" />
                <FormControlLabel value="TUSD" control={<Radio />} label="TUSD" />
                <FormControlLabel value="SUSD" control={<Radio />} label="SUSD" />
              </RadioGroup>
            </div>
            <Button
              className={ classes.actionButton }
              variant="outlined"
              color="primary"
              disabled={ loading }
              onClick={ this.onExchange }
              fullWidth
              >
              <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>{ t('PoolExchange.Exchange') }</Typography>
            </Button>
          </Card>
        </div>
        { snackbarMessage && this.renderSnackbar() }
        { loading && <Loader /> }
      </div>
    )
  };

  onExchange = () => {
    const { sendAsset, receiveAsset, sendAmount } = this.state

    if(!sendAmount || isNaN(sendAmount) || sendAmount <= 0) {
      this.setState({ amountError: true })
      return false
    }

    this.setState({ loading: true })
    dispatcher.dispatch({ type: EXCHANGE_POOL, content: { sendAsset, receiveAsset, sendAmount } })
  }

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };

  onChange = (event) => {

    if(event.target.value !== '') {
      if(!event.target.value || isNaN(event.target.value) || event.target.value < 0) {
        this.setState({ amountError: true })
        return false
      }
    }

    let val = []
    val[event.target.name] = event.target.value
    this.setState(val)

    dispatcher.dispatch({ type: GET_EXCHANGE_PRICE, content: { sendAsset: this.state.sendAsset, receiveAsset: this.state.receiveAsset, sendAmount: event.target.value !== '' ? event.target.value : '0' }})
  };

  renderAmountInput = (id, value, error, label, placeholder, disabled) => {
    const { classes, loading } = this.props
    const { assets } =  this.state

    return (
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
      />
    )
  }

  setAmount(id, balance) {
    let val = []
    val[id] = balance.toFixed(4)
    this.setState(val)
  }

  handleChange = (event) => {
    let val = []
    val[event.target.name] = event.target.value
    this.setState(val)

    let sendAsset = this.state.sendAsset
    let receiveAsset = this.state.receiveAsset

    if(event.target.name === 'sendAsset') {
      sendAsset = event.target.value
    } else if (event.target.name === 'receiveAsset') {
      receiveAsset = event.target.value
    }

    dispatcher.dispatch({ type: GET_EXCHANGE_PRICE, content: { sendAsset: sendAsset, receiveAsset: receiveAsset, sendAmount: this.state.sendAmount ? this.state.sendAmount : '0' }})
  }

}

export default withNamespaces()(withRouter(withStyles(styles)(Exchange)));
