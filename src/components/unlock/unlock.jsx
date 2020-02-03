import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button
} from '@material-ui/core';

import {
  ERROR,
  CONNECT_METAMASK,
  METAMASK_CONNECTED,
  CONNECT_LEDGER,
  LEDGER_CONNECTED
} from '../../constants'

import Store from "../../stores";
const dispatcher = Store.dispatcher
const emitter = Store.emitter
// const store = Store.store

const styles = theme => ({
  root: {
    flex: 1,
    height: 'auto',
    display: 'flex'
  },
  contentContainer: {
    margin: 'auto',
    maxWidth: '900px',
    textAlign: 'center',
    padding: '24px'
  },
  cardContainer: {
    marginTop: '60px',
    minHeight: '260px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  unlockCard: {
    padding: '24px'
  },
  metamaskIcon: {
    backgroundImage: 'url('+require('../../assets/icn-metamask.svg')+')',
    width: '30px',
    height: '30px'
  },
  ledgerIcon: {
    backgroundImage: 'url('+require('../../assets/icn-ledger.svg')+')',
    width: '30px',
    height: '30px'
  },
  buttonText: {
    marginLeft: '12px',
    fontWeight: '700',
  },
  instruction: {
    maxWidth: '400px',
    marginBottom: '32px',
    marginTop: '32px'
  },
  metamask: {
    backgroundImage: 'url('+require('../../assets/metamask.svg')+')',
    width: '200px',
    height: '200px'
  },
  ledger: {
    backgroundImage: 'url('+require('../../assets/icn-ledger.svg')+')',
    backgroundSize: '100%',
    width: '200px',
    height: '200px'
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
});

class Unlock extends Component {

  constructor(props) {
    super()

    this.state = {
      error: null,
      metamaskLoading: false,
      ledgerLoading: false
    }
  }

  componentWillMount() {
    emitter.on(METAMASK_CONNECTED, this.metamaskUnlocked);
    emitter.on(LEDGER_CONNECTED, this.ledgerUnlocked);
    emitter.on(ERROR, this.error);
  };

  componentWillUnmount() {
    emitter.removeListener(METAMASK_CONNECTED, this.metamaskUnlocked);
    emitter.removeListener(LEDGER_CONNECTED, this.ledgerUnlocked);
    emitter.removeListener(ERROR, this.error);
  };

  navigateInvest = () => {
    this.props.history.push('/invest')
  }

  unlockMetamask = () => {
    this.setState({ metamaskLoading: true })
    dispatcher.dispatch({ type: CONNECT_METAMASK, content: {} })
  }

  unlockLedger = () => {
    this.setState({ ledgerLoading: true })
    dispatcher.dispatch({ type: CONNECT_LEDGER, content: {} })
  }

  error = (err) => {
    this.setState({ loading: false, error: err, metamaskLoading: false, ledgerLoading: false })
  };

  metamaskUnlocked = () => {
    this.setState({ metamaskLoading: false })
    if(this.props.closeModal != null) {
      this.props.closeModal()
    }
  }

  ledgerUnlocked = () => {
    this.setState({ ledgerLoading: false })
    if(this.props.closeModal != null) {
      this.props.closeModal()
    }
  }

  cancelLedger = () => {
    this.setState({ ledgerLoading: false })
  }

  cancelMetamask = () => {
    this.setState({ metamaskLoading: false })
  }

  render() {
    const { classes } = this.props;
    const { metamaskLoading, ledgerLoading } = this.state;

    return (
      <div className={ classes.root }>
        <div className={ classes.contentContainer }>
          <Typography variant={ 'h3'}>Connect your wallet to use iearn finance</Typography>
          { metamaskLoading && this.renderMetamaskLoading() }
          { ledgerLoading && this.renderLedgerLoading() }
          { (!metamaskLoading && !ledgerLoading) && this.renderOptions() }
        </div>
      </div>
    )
  };

  renderMetamaskLoading = () => {
    const { classes } = this.props;

    return (<div className={ classes.cardContainer }>
      <div className={ classes.metamask }>
      </div>
      <Typography variant={ 'h3'} className={ classes.instruction }>
        Click connect in the MetaMask notification window to connect your wallet to iearn finance.
      </Typography>
      <Button className={ classes.actionButton } variant='outlined' color='primary' onClick={ this.cancelMetamask } fullWidth>
        <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Cancel</Typography>
      </Button>
    </div>)
  };

  renderLedgerLoading = () => {
    const { classes } = this.props;

    return (<div className={ classes.cardContainer }>
      <div className={ classes.ledger }>
      </div>
      <Typography variant={ 'h3'} className={ classes.instruction }>
        Insert yout ledger device and authorize iEarn.
      </Typography>
      <Button className={ classes.actionButton } variant='outlined' color='primary' onClick={ this.cancelLedger } fullWidth>
        <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Cancel</Typography>
      </Button>
    </div>)
  }

  renderOptions = () => {
    const { classes, closeModal } = this.props;

    return (
      <div className={ classes.cardContainer }>
        <Button className={ classes.actionButton } variant='outlined' color='primary' onClick={ this.unlockMetamask } fullWidth>
          <div className={ classes.metamaskIcon }></div>
          <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Unlock using Metamask</Typography>
        </Button>
        <Button className={ classes.actionButton } variant='outlined' color='primary' onClick={ this.unlockLedger } fullWidth>
          <div className={ classes.ledgerIcon }></div>
          <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Unlock using Ledger</Typography>
        </Button>
        { closeModal != null && <Button className={ classes.actionButton } variant='outlined' color='secondary' onClick={ closeModal } fullWidth>
          <Typography className={ classes.buttonText } variant={ 'h5'}>Close</Typography>
        </Button>}
      </div>
    )
  };
}

/*

*/

export default withRouter(withStyles(styles)(Unlock));
