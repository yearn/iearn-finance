import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  Typography,
  Button
} from '@material-ui/core';

import Have from './have'
import Want from './want'
import Sending from './sending'
import ConversionRatios from './conversionRatios'
import Loader from '../loader'
import Snackbar from '../snackbar'
import { colors } from '../../theme'

import {
  ERROR,
  GET_BALANCES,
  BALANCES_RETURNED,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  ZAP,
  ZAP_RETURNED,
  GET_CURV_BALANCE,
  GET_CURV_BALANCE_RETURNED,
  SWAP,
  SWAP_RETURNED,
  TRADE,
  TRADE_RETURNED,
  GET_BEST_PRICE,
  GET_BEST_PRICE_RETURNED
} from '../../constants'

import { withNamespaces } from 'react-i18next';
import Store from "../../stores";
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
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  investedContainerLoggedOut: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100%',
    marginTop: '40px',
    [theme.breakpoints.up('md')]: {
      minWidth: '900px',
    }
  },
  iHaveContainer: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    padding: '42px 30px',
    borderRadius: '50px',
    maxWidth: '500px',
    justifyContent: 'center',
    border: '1px solid '+colors.borderBlue,
  },
  iWantContainer: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    padding: '24px'
  },
  conversionRatioContainer: {
    width: '100%',
    display: 'flex'
  },
  sendingContainer: {
    flex: 1,
    display: 'flex',
  },
  receivingContainer: {
    flex: 1,
    display: 'flex',
  },
  feesContainer: {
    display: 'flex'
  },
  card: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '400px',
    justifyContent: 'center',
    minWidth: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '40px'
  },
  intro: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '32px',
    maxWidth: '500px'
  },
  actualIntro: {
    paddingBottom: '32px',
  },
  introCenter: {
    minWidth: '100%',
    textAlign: 'center',
    padding: '24px 0px'
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
  sepperator: {
    borderBottom: '1px solid #E1E1E1',
    minWidth: '100%',
    marginBottom: '24px',
    marginTop: '24px'
  },
  addressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
    flex: 1,
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    textOverflow:'ellipsis',
    cursor: 'pointer',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      width: '100%'
    }
  },
  disaclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    marginBottom: '24px',
    background: colors.white
  },
  walletAddress: {
    padding: '0px 12px'
  },
  walletTitle: {
    flex: 1,
    color: colors.darkGray
  },
  grey: {
    color: colors.darkGray
  },
});

class Zap extends Component {

  constructor() {
    super()

    const account = store.getStore('account')

    this.state = {
      account: account,
      assets: store.getStore('assets').filter((asset) => asset.curve === true),
      curveContracts: store.getStore('curveContracts'),
      sendAsset: null,
      receiveAsset: null,
      sendAmount: "",
      // receiveAmount: ""
      bestPrice: 0
    }

    if(account && account.address) {
      dispatcher.dispatch({ type: GET_BALANCES, content: {} })
      dispatcher.dispatch({ type: GET_CURV_BALANCE, content: {} })
    }
  }

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(BALANCES_RETURNED, this.balancesReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(ZAP_RETURNED, this.zapReturned);
    emitter.on(SWAP_RETURNED, this.swapReturned);
    emitter.on(TRADE_RETURNED, this.tradeReturned);
    emitter.on(GET_CURV_BALANCE_RETURNED, this.getCurvBalanceReturned);
    emitter.on(GET_BEST_PRICE_RETURNED, this.getBestPriceReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(BALANCES_RETURNED, this.balancesReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(ZAP_RETURNED, this.zapReturned);
    emitter.removeListener(SWAP_RETURNED, this.swapReturned);
    emitter.removeListener(TRADE_RETURNED, this.tradeReturned);
    emitter.removeListener(GET_CURV_BALANCE_RETURNED, this.getCurvBalanceReturned);
    emitter.removeListener(GET_BEST_PRICE_RETURNED, this.getBestPriceReturned);
  };

  swapReturned = (txHash) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false, sendAmount: '', sendAsset: null, receiveAsset: null })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  }

  zapReturned = (txHash) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false, sendAmount: '', sendAsset: null, receiveAsset: null })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  }

  tradeReturned = (txHash) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false, sendAmount: '', sendAsset: null, receiveAsset: null })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  }

  balancesReturned = (balances) => {
    this.setState({ assets: store.getStore('assets').filter((asset) => asset.curve === true) })
    this.setSendAsset(store.getStore('assets').filter((asset) => asset.curve === true)[0])
  };

  getCurvBalanceReturned = (balance) => {
    this.setState({ curveContracts: store.getStore('curveContracts') })
  };

  getBestPriceReturned = (price) => {
    this.setState({ bestPrice: price })
  };

  refresh() {
    dispatcher.dispatch({ type: GET_BALANCES, content: {} })
    dispatcher.dispatch({ type: GET_CURV_BALANCE, content: {} })
  }

  connectionConnected = () => {
    const { t } = this.props

    this.setState({ account: store.getStore('account') })

    dispatcher.dispatch({ type: GET_BALANCES, content: {} })
    dispatcher.dispatch({ type: GET_CURV_BALANCE, content: {} })

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
      assets,
      curveContracts,
      sendAsset,
      sendAmount,
      receiveAsset,
      // receiveAmount,
      account,
      loading,
      snackbarMessage,
      bestPrice
    } = this.state

    if(!account || !account.address) {
      return (
        <div className={ classes.root }>
          <div className={ classes.investedContainerLoggedOut }>
          <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>
            <div className={ classes.introCenter }>
              <Typography variant='h3'>Connect your wallet to continue</Typography>
            </div>
          </div>
          { snackbarMessage && this.renderSnackbar() }
        </div>
      )
    }

    return (
      <div className={ classes.root }>
        <div className={ classes.card }>
          <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>
          <Card className={ classes.iHaveContainer }>
            <Have assets={ assets } curveContracts={ curveContracts } setSendAsset={ this.setSendAsset } sendAsset={ sendAsset } setSendAmountPercent={ this.setSendAmountPercent } loading={ loading } />
            <Sending sendAsset={ sendAsset } sendAmount={ sendAmount } setSendAmount={ this.setSendAmount } setSendAmountPercent={ this.setSendAmountPercent } loading={ loading }  />
            <div className={ classes.sepperator }></div>
            { (sendAsset && sendAsset.symbol === 'ETH') &&
              <ConversionRatios bestPrice={ bestPrice } sendAsset={ sendAsset } receiveAsset={ receiveAsset } />
            }
            <Want assets={ assets } curveContracts={ curveContracts } receiveAsset={ receiveAsset } setReceiveAsset={ this.setReceiveAsset } sendAsset={ sendAsset } loading={ loading } bestPrice={ bestPrice } sendAmount={ sendAmount } />
            <div className={ classes.sepperator }></div>
            { (sendAsset && receiveAsset && !(['crvV3', 'crvV4'].includes(receiveAsset.id) && ['crvV1', 'crvV2', 'crvV3'].includes(sendAsset.id)) && !(sendAsset && sendAsset.symbol === 'ETH')) && <Button
              className={ classes.actionButton }
              variant="outlined"
              color="primary"
              disabled={ loading || !sendAsset || !receiveAsset || !sendAmount || sendAmount === '' }
              onClick={ this.onZap }
              fullWidth
              >
              <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>{ t('Zap.Zap') }</Typography>
            </Button> }
            { (sendAsset && receiveAsset && ['crvV3', 'crvV4'].includes(receiveAsset.id) && ['crvV1', 'crvV2', 'crvV3'].includes(sendAsset.id)) && <Button
              className={ classes.actionButton }
              variant="outlined"
              color="primary"
              disabled={ loading || !sendAsset || !receiveAsset || !sendAmount || sendAmount === '' }
              onClick={ this.onSwap }
              fullWidth
              >
              <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>{ t('Zap.Swap') }</Typography>
            </Button> }
            { (sendAsset && sendAsset.symbol === 'ETH') && <Button
              className={ classes.actionButton }
              variant="outlined"
              color="primary"
              disabled={ loading || !sendAsset || !receiveAsset || !sendAmount || sendAmount === '' }
              onClick={ this.onTrade }
              fullWidth
              >
              <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>{ t('Zap.Trade') }</Typography>
            </Button> }
          </Card>
          <div className={ classes.introCenter }>
          </div>
        </div>
        { snackbarMessage && this.renderSnackbar() }
        { loading && <Loader /> }
      </div>
    )
  };

  onZap = () => {
    this.setState({ amountError: false })

    const { sendAmount, sendAsset, receiveAsset } = this.state

    if(!sendAmount || isNaN(sendAmount) || sendAmount <= 0 || parseFloat(sendAmount) > sendAsset.balance) {
      this.setState({ amountError: true })
      return false
    }

    this.setState({ loading: true })
    dispatcher.dispatch({ type: ZAP, content: { amount: sendAmount, sendAsset: sendAsset, receiveAsset: receiveAsset } })
  }

  onSwap = () => {
    this.setState({ amountError: false })

    const { sendAmount, sendAsset, receiveAsset } = this.state

    if(!sendAmount || isNaN(sendAmount) || sendAmount <= 0 || parseFloat(sendAmount) > sendAsset.balance) {
      this.setState({ amountError: true })
      return false
    }

    this.setState({ loading: true })
    dispatcher.dispatch({ type: SWAP, content: { amount: sendAmount, sendAsset: sendAsset, receiveAsset: receiveAsset } })
  }

  onTrade = () => {
    this.setState({ amountError: false })

    const { sendAmount, sendAsset, receiveAsset } = this.state

    if(!sendAmount || isNaN(sendAmount) || sendAmount <= 0 || parseFloat(sendAmount) > sendAsset.balance) {
      this.setState({ amountError: true })
      return false
    }

    this.setState({ loading: true })
    dispatcher.dispatch({ type: TRADE, content: { amount: sendAmount, sendAsset: sendAsset, receiveAsset: receiveAsset } })
  }

  setReceiveAsset = (receiveAsset) => {
    this.setState({ receiveAsset })
  }

  setSendAsset = (sendAsset) => {
    let receiveAsset = this.state.receiveAsset

    if(['ETH'].includes(sendAsset.symbol) && sendAsset.balance > 0) {
      receiveAsset = store.getStore('assets').filter((asset) => { return asset.id === 'DAIv2'})[0]
      dispatcher.dispatch({ type: GET_BEST_PRICE, content: { amount: sendAsset.balance, sendAsset: sendAsset, receiveAsset: receiveAsset }})
    }

    const balance = sendAsset.balance
    let sendAmount = balance*100/100

    sendAmount = Math.floor(sendAmount*10000)/10000;

    this.setState({ sendAsset, receiveAsset, sendAmount: sendAmount.toFixed(4) })
  }

  setSendAmountPercent = (percent) => {
    const { sendAsset, receiveAsset } = this.state

    const balance = sendAsset.balance
    let sendAmount = balance*percent/100

    sendAmount = Math.floor(sendAmount*10000)/10000;
    this.setState({ sendAmount: sendAmount.toFixed(4) })

    if(['ETH'].includes(sendAsset.symbol) && sendAmount > 0) {
      dispatcher.dispatch({ type: GET_BEST_PRICE, content: { amount: sendAmount, sendAsset: sendAsset, receiveAsset: receiveAsset }})
    }
  }

  setSendAmount = (amount) => {
    this.setState({ sendAmount: amount })

    const { sendAsset, receiveAsset } = this.state

    if(['ETH'].includes(sendAsset.symbol) && amount > 0) {
      dispatcher.dispatch({ type: GET_BEST_PRICE, content: { amount: amount, sendAsset: sendAsset, receiveAsset: receiveAsset }})
    }
  }

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };
}

export default withNamespaces()(withRouter(withStyles(styles)(Zap)));
