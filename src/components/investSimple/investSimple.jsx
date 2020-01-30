import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Card,
  TextField,
  Button,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import UnlockModal from '../unlock/unlockModal.jsx'
import InvestModal from './investModal.jsx'
import RedeemModal from './redeemModal.jsx'
import Snackbar from '../snackbar'
import Asset from './asset'
import Loader from '../loader'

import {
  ERROR,
  GET_BALANCES,
  BALANCES_RETURNED,
  GET_INVESTED_BALANCES,
  INVESTED_BALANCES_RETURNED,
  INVEST,
  INVEST_RETURNED,
  REDEEM,
  REDEEM_RETURNED,
  CONNECT_METAMASK,
  CONNECT_METAMASK_PASSIVE,
  METAMASK_CONNECTED
} from '../../constants'

import config from '../../config'

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
    marginBottom: '-25px',
    marginRight: '30px',
    zIndex: '900',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between'
  },
  actionsContainer: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '900px',
    [theme.breakpoints.up('md')]: {
      width: '750px',
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
    borderRadius: '3rem',
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
  heading: {
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  footer: {
    position: 'fixed',
    bottom: '30px',
    left: '30px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerText: {
    padding: '10px',
    cursor: 'pointer'
  }
});

class InvestSimple extends Component {

  constructor() {
    super()

    dispatcher.dispatch({ type: CONNECT_METAMASK_PASSIVE, content: {} })

    this.state = {
      assets: store.getStore('assets'),
      referralLink: '',
      roi: 4,
      account: store.getStore('account'),
      modalOpen: false,
      investModalOpen: false,
      redeemModalOpen: false,
      snackbarType: null,
      snackbarMessage: null,
      amount: '',
      amountError: false,
      redeemAmount: '',
      redeemAmountError: false
    }
  }

  componentWillMount() {
    emitter.on(METAMASK_CONNECTED, this.metamaskConnected);
    emitter.on(INVEST_RETURNED, this.investReturned);
    emitter.on(REDEEM_RETURNED, this.redeemReturned);
    emitter.on(ERROR, this.errorReturned);

    emitter.on(BALANCES_RETURNED, this.balancesReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(METAMASK_CONNECTED, this.metamaskConnected);
    emitter.removeListener(INVEST_RETURNED, this.investReturned);
    emitter.removeListener(REDEEM_RETURNED, this.redeemReturned);
    emitter.removeListener(ERROR, this.errorReturned);

    emitter.removeListener(BALANCES_RETURNED, this.balancesReturned);
  };

  balancesReturned = (balances) => {
    this.setState({ assets: store.getStore('assets') })
  };

  metamaskConnected = () => {
    this.setState({ account: store.getStore('account') })

    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: 'Metamask wallet succesfully connected.', snackbarType: 'Info' }
      that.setState(snackbarObj)
    })
  };

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

  investReturned = (txHash) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Success' }
      that.setState(snackbarObj)
    })
  };

  redeemReturned = (txHash) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Success' }
      that.setState(snackbarObj)
    })
  };

  render() {
    const { classes } = this.props;
    const {
      amount,
      amountError,
      redeemAmount,
      redeemAmountError,
      referralLink,
      referralLinkError,
      loading,
      roi,
      account,
      modalOpen,
      investModalOpen,
      redeemModalOpen,
      snackbarMessage
    } = this.state
    return (
      <div className={ classes.root }>
        <div className={ classes.investedContainer }>
          <div className={ classes.intro }>
            <Typography variant='h2'>Earn interest. Simple.</Typography>
          </div>
          <div className={ classes.balancesContainer }>
            { false && <div className={ classes.overlay } onClick={ this.overlayClicked }>
              <Typography variant='h1' >Connect wallet</Typography>
            </div>}
          </div>

          {!account.address &&
            <div className={ classes.connectContainer }>
              <Button
                className={ classes.actionButton }
                variant="outlined"
                color="primary"
                disabled={ loading }
                onClick={ this.unlockMetamask }
                >
                <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Connect Wallet</Typography>
              </Button>
            </div>
          }

          { account.address && this.renderAssetBlocks() }
        </div>
        { loading && <Loader /> }
        <div className={classes.footer}>
          <Typography onClick={()=> window.open("https://docs.iearn.finance", "_blank")} className={ classes.footerText } variant={ 'h6'}>about</Typography>
          <Typography onClick={()=> window.open("https://docs.iearn.finance", "_blank")} className={ classes.footerText } variant={ 'h6'}>docs</Typography>
          <Typography onClick={()=> window.open("https://github.com/iearn-finance", "_blank")} className={ classes.footerText } variant={ 'h6'}>code</Typography>
          <Typography onClick={()=> window.open("https://t.me/iearnfinance", "_blank")} className={ classes.footerText } variant={ 'h6'}>telegram</Typography>
          <Typography onClick={()=> window.open("/apr", "_blank")} className={ classes.footerText } variant={ 'h6'}>yield</Typography>
        </div>
        { modalOpen && this.renderModal() }
        { snackbarMessage && this.renderSnackbar() }
      </div>
    )
  };


  renderAssetBlocks = () => {
    const { assets, expanded } = this.state
    const { classes } = this.props

    return assets.map((asset) => {
      return (
        <ExpansionPanel key={ asset.symbol+"_expand" } expanded={ expanded === asset.symbol} onChange={ () => { this.handleChange(asset.symbol) } }>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography className={classes.heading} variant={ 'h3' }>{ asset.name }</Typography>
            <Typography className={classes.heading} variant={ 'h4' }>{ asset.symbol + ' : ' + asset.investSymbol }</Typography>
            <Typography className={classes.heading} variant={ 'h4' }>{ 'APR: '+(asset.maxApr*100).toFixed(4) + ' %' }</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Asset asset={ asset } startLoading={ this.startLoading } />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )
    })
  }
  renderSnackbar() {
    const {
      snackbarType,
      snackbarMessage
    } = this.state

    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true} />
  };

  setAmount = (percent) => {

    if(this.state.loading) {
      return
    }

    const balance = store.getStore('ethBalance')
    let amount = balance*percent/100

    if(percent === 100 && amount > 0.009) {
        amount = amount - 0.009
    }

  }

  handleChange = (symbol) => {
    this.setState({ expanded: symbol })
  }
  setRedeemAmount = (percent) => {

    if(this.state.loading) {
      return
    }

    const balance = store.getStore('iEthBalance')
    let amount = balance*percent/100

    if(percent === 100 && amount > 0.009) {
        amount = amount - 0.009
    }

    this.setState({ redeemAmount: amount.toFixed(8) })
  }

  startLoading = () => {
    this.setState({ loading: true })
  }

  renderSnackbar = () => {
    const {
      snackbarType,
      snackbarMessage
    } = this.state

    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true} />
  };

  unlockMetamask = () => {
    this.setState({ metamaskLoading: true })
    dispatcher.dispatch({ type: CONNECT_METAMASK, content: {} })
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } />
    )
  }

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }
}

export default withRouter(withStyles(styles)(InvestSimple));
