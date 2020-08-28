import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import UnlockModal from '../unlock/unlockModal.jsx'
import Snackbar from '../snackbar'
import Asset from './asset'
import Loader from '../loader'

import {
  ERROR,
  GET_BALANCES,
  BALANCES_RETURNED,
  DONATE_RETURNED,
  REBALANCE_RETURNED,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED
} from '../../constants'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 4
})

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1200px',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  value: {
    cursor: 'pointer'
  },
  investedContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
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
    padding: '12px 12px',
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
    maxWidth: '1200px',
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
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '24px'
  },
  introCenter: {
    maxWidth: '500px',
    textAlign: 'center',
    display: 'flex',
  },
  title: {
    paddingRight: '24px'
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
    paddingTop: '5px',
    flexBasis: '25%',
    flexShrink: 0,
  },
  footer: {
    position: 'absolute',
    bottom: '30px',
    left: '30px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerText: {
    padding: '10px',
    cursor: 'pointer'
  },
  buttonText: {
    fontWeight: '700',
    color: 'white',
  },
  assetSummary: {
    display: 'flex',
    alignItems: 'center',
    flex: 1
  },
  assetIcon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    borderRadius: '20px',
    height: '40px',
    width: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    marginRight: '24px'
  },
  addressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '100px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    margin: "0px 0.5rem 0px 0.25rem",
    textOverflow:'ellipsis',
    cursor: 'pointer',
    padding: '10px',
    borderRadius: '0.75rem',
    [theme.breakpoints.up('md')]: {
      maxWidth: '150px',
    }
  },
  accordionRoot: {
    width: '1200px'
  }
});

class Manage extends Component {

  constructor() {
    super()

    this.state = {
      assets: store.getStore('assets'),
      account: store.getStore('account'),
      modalOpen: false,
      snackbarType: null,
      snackbarMessage: null,
    }
  }
  componentWillMount() {
    // emitter.on(METAMASK_CONNECTED, this.metamaskConnected);
    // emitter.on(LEDGER_CONNECTED, this.ledgerConnected);
    emitter.on(DONATE_RETURNED, this.investReturned);
    emitter.on(REBALANCE_RETURNED, this.redeemReturned);
    emitter.on(ERROR, this.errorReturned);
    emitter.on(BALANCES_RETURNED, this.balancesReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);

  }

  componentWillUnmount() {
    // emitter.removeListener(METAMASK_CONNECTED, this.metamaskConnected);
    // emitter.removeListener(LEDGER_CONNECTED, this.ledgerConnected);
    emitter.removeListener(DONATE_RETURNED, this.investReturned);
    emitter.removeListener(REBALANCE_RETURNED, this.redeemReturned);
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);

    emitter.removeListener(BALANCES_RETURNED, this.balancesReturned);
  };

  refresh() {
    dispatcher.dispatch({ type: GET_BALANCES, content: {} })
  }

  balancesReturned = (balances) => {
    this.setState({ assets: store.getStore('assets') })
  };

  connectionConnected = () => {
    this.setState({ account: store.getStore('account') })

    dispatcher.dispatch({ type: GET_BALANCES, content: {} })

    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: 'Wallet succesfully connected.', snackbarType: 'Info' }
      that.setState(snackbarObj)
    })
  };

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account') })
  }

  metamaskConnected = () => {
    this.setState({ account: store.getStore('account') })

    dispatcher.dispatch({ type: GET_BALANCES, content: {} })

    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: 'Metamask wallet succesfully connected.', snackbarType: 'Info' }
      that.setState(snackbarObj)
    })
  };

  ledgerConnected = () => {
    this.setState({ account: store.getStore('account') })

    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: 'Ledger succesfully connected.', snackbarType: 'Info' }
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
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  };

  redeemReturned = (txHash) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  };

  render() {
    const { classes } = this.props;
    const {
      loading,
      account,
      modalOpen,
      snackbarMessage
    } = this.state

    return (
      <div className={ classes.root }>
        <div className={ classes.investedContainer }>
          { account.address &&
            <div className={ classes.intro }>
              <Typography variant='h3'>Management. You should probably not be here.</Typography>
            </div>
          }
          { !account.address &&
            <div className={ classes.introCenter }>
              <Typography variant='h3'>Management. Simplified.</Typography>
            </div>
          }
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
                onClick={ this.overlayClicked }
                >
                <Typography className={ classes.buttonText } variant={ 'h5'}>Connect Wallet</Typography>
              </Button>
            </div>
          }

          { account.address && this.renderAssetBlocks() }
        </div>
        { loading && <Loader /> }
        { modalOpen && this.renderModal() }
        { snackbarMessage && this.renderSnackbar() }
      </div>
    )
  };


  renderAssetBlocks = () => {
    const { assets, expanded } = this.state
    const { classes } = this.props

    console.log(assets);

    return assets.map((asset) => {
      return (
        <Accordion square key={ asset.symbol+"_expand" } expanded={ expanded === asset.symbol} onChange={ () => { this.handleChange(asset.symbol) } } className={ classes.accordionRoot } >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <div className={ classes.assetSummary }>
              <div className={ classes.assetIcon }>
                <img
                  alt=""
                  src={ require('../../assets/'+asset.symbol+'-logo.png') }
                  height="40px"
                />
              </div>
              <div className={classes.heading}>
                <Typography className={classes.heading} variant={ 'h3' }>{ asset.name }</Typography>
                <Typography className={classes.heading} variant={ 'h5' }>{ asset.description }</Typography>
              </div>
              <div className={classes.heading}>
                <Typography className={classes.heading} variant={ 'h3' }>{ (asset.maxApr*100).toFixed(4) + ' %' }</Typography>
                <Typography className={classes.heading} variant={ 'h5' }>{'Interest Rate'}</Typography>
              </div>
              <div className={classes.heading}>
                <Typography className={classes.heading} variant={ 'h3' }>{ (asset.apy*100).toFixed(4) + ' %' }</Typography>
                <Typography className={classes.heading} variant={ 'h5' }>{'Annual Yield'}</Typography>
              </div>
              <div className={classes.heading}>
                <Typography className={classes.heading} variant={ 'h3' }>{formatter.format(asset.poolValue)+' '+( asset.tokenSymbol ? asset.tokenSymbol : asset.symbol )}</Typography>
                <Typography className={classes.heading} variant={ 'h5' }>{'Pool Balance'}</Typography>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Asset asset={ asset } startLoading={ this.startLoading } />
          </AccordionDetails>
        </Accordion>
      )
    })
  }

  handleChange = (symbol) => {
    this.setState({ expanded: this.state.expanded === symbol ? null : symbol })
  }

  startLoading = () => {
    this.setState({ loading: true })
  }

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }
}

export default withRouter(withStyles(styles)(Manage));
