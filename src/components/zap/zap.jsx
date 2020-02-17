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
//import Receiving from './receiving'
// import ConversionRatios from './conversionRatios'
// import Fees from './fees'
import Loader from '../loader'
import BuiltWithModal from '../builtwith/builtwithModal.jsx'
import UnlockModal from '../unlock/unlockModal.jsx'
import Snackbar from '../snackbar'

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
  SWAP_RETURNED
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  iHaveContainer: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    padding: '24px',
    borderRadius: '1.25em',
    maxWidth: '400px',
    justifyContent: 'center'
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
    marginTop: '60px',
    flexWrap: 'wrap',
    maxWidth: '900px',
    justifyContent: 'center'
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
  sepperator: {
    borderBottom: '1px solid #E1E1E1',
    minWidth: '100%',
    marginBottom: '24px',
    marginTop: '24px'
  },
});

class Zap extends Component {

  constructor() {
    super()

    this.state = {
      account: store.getStore('account'),
      assets: store.getStore('assets').filter((asset) => asset.curve === true),
      curveContracts: store.getStore('curveContracts'),
      sendAsset: null,
      receiveAsset: null,
      sendAmount: "",
      // receiveAmount: ""
    }
  }

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(BALANCES_RETURNED, this.balancesReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(ZAP_RETURNED, this.zapReturned);
    emitter.on(SWAP_RETURNED, this.swapReturned);
    emitter.on(GET_CURV_BALANCE_RETURNED, this.getCurvBalanceReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(BALANCES_RETURNED, this.balancesReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(ZAP_RETURNED, this.zapReturned);
    emitter.removeListener(SWAP_RETURNED, this.swapReturned);
    emitter.removeListener(GET_CURV_BALANCE_RETURNED, this.getCurvBalanceReturned);
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

  balancesReturned = (balances) => {
    this.setState({ assets: store.getStore('assets').filter((asset) => asset.curve === true) })
    setTimeout(this.refresh,10000);
  };

  getCurvBalanceReturned = (balance) => {
    this.setState({ curveContracts: store.getStore('curveContracts') })
  };

  refresh() {
    dispatcher.dispatch({ type: GET_BALANCES, content: {} })
    dispatcher.dispatch({ type: GET_CURV_BALANCE, content: {} })
  }

  connectionConnected = () => {
    this.setState({ account: store.getStore('account') })

    dispatcher.dispatch({ type: GET_BALANCES, content: {} })
    dispatcher.dispatch({ type: GET_CURV_BALANCE, content: {} })

    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: 'Wallet succesfully connected.', snackbarType: 'Info' }
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
      modalOpen,
      modalBuiltWithOpen,
      snackbarMessage
    } = this.state

    return (
      <div className={ classes.root }>
        { !account.address &&
          <div className={ classes.investedContainer }>
              <div className={ classes.introCenter }>
                <Typography variant='h2'>{ t('InvestSimple.Intro') }</Typography>
              </div>
              <div className={ classes.connectContainer }>
                <Button
                  className={ classes.actionButton }
                  variant="outlined"
                  color="primary"
                  disabled={ loading }
                  onClick={ this.overlayClicked }
                  >
                  <Typography className={ classes.buttonText } variant={ 'h5'}>{ t('InvestSimple.Connect') }</Typography>
                </Button>
              </div>
          </div>
        }
        { account.address &&
          <div className={ classes.card }>
            <div className={ classes.introCenter }>
              <Typography variant='h2'>{ t('Zap.Intro') }</Typography>
            </div>
            <Card className={ classes.iHaveContainer }>
              <Have assets={ assets } curveContracts={ curveContracts } setSendAsset={ this.setSendAsset } sendAsset={ sendAsset } setSendAmountPercent={ this.setSendAmountPercent } loading={ loading } />
              <Sending sendAsset={ sendAsset } sendAmount={ sendAmount } setSendAmount={ this.setSendAmount } setSendAmountPercent={ this.setSendAmountPercent } loading={ loading }  />
              <div className={ classes.sepperator }></div>
              <Want assets={ assets } curveContracts={ curveContracts } receiveAsset={ receiveAsset } setReceiveAsset={ this.setReceiveAsset } loading={ loading }  />
              <div className={ classes.sepperator }></div>
              { (!receiveAsset || receiveAsset.symbol !== 'CurveV3') && <Button
                className={ classes.actionButton }
                variant="outlined"
                color="primary"
                disabled={ loading }
                onClick={ this.onZap }
                fullWidth
                >
                <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>{ t('Zap.Zap') }</Typography>
              </Button> }
              { (receiveAsset && receiveAsset.symbol === 'CurveV3') && <Button
                className={ classes.actionButton }
                variant="outlined"
                color="primary"
                disabled={ loading }
                onClick={ this.onSwap }
                fullWidth
                >
                <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>{ t('Zap.Swap') }</Typography>
              </Button> }
            </Card>
            <div className={ classes.introCenter }>
            </div>
          </div>
        }
        { modalOpen && this.renderModal() }
        { modalBuiltWithOpen && this.renderBuiltWithModal() }
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

  setReceiveAsset = (receiveAsset) => {
    this.setState({ receiveAsset })
  }

  setSendAsset = (sendAsset) => {
    let receiveAsset = null
    if(sendAsset && sendAsset.symbol !== 'Curve.fi') {
      receiveAsset = {
        id: 'CRV',
        name: 'Curve.fi yDAI+yUSDC+yUSDT+yTUSD',
        symbol: 'Curve.fi',
        balance: store.getStore('curvBalance')
      }
    }

    if(['CurveV1', 'CurveV2'].includes(sendAsset.symbol)) {
      receiveAsset = store.getStore('curveContracts').filter((contract) => { return contract.symbol === 'CurveV3'})[0]
    }

    this.setState({ sendAsset, receiveAsset })
  }

  setSendAmountPercent = (percent) => {
    const { sendAsset } = this.state

    const balance = sendAsset.balance
    let sendAmount = balance*percent/100

    sendAmount = Math.floor(sendAmount*10000)/10000;
    this.setState({ sendAmount: sendAmount.toFixed(4) })
  }

  setSendAmount = (amount) => {
    this.setState({ sendAmount: amount })
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }

  renderBuiltWithModal = () => {
    return (
      <BuiltWithModal closeModal={ this.closeBuiltWithModal } modalOpen={ this.state.modalBuiltWithOpen } />
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

  builtWithOverlayClicked = () => {
    this.setState({ modalBuiltWithOpen: true })
  }

  closeBuiltWithModal = () => {
    this.setState({ modalBuiltWithOpen: false })
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Zap)));
