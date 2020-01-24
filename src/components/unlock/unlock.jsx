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
  METAMASK_CONNECTED
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
    marginLeft: '12px'
  },
  instruction: {
    maxWidth: '400px',
    marginBottom: '32px'
  },
  metamask: {
    backgroundImage: 'url('+require('../../assets/metamask.svg')+')',
    width: '200px',
    height: '200px'
  }
});

class Unlock extends Component {

  constructor(props) {
    super()

    this.state = {
      error: null,
      metamaskLoading: false
    }
  }

  componentWillMount() {
    emitter.on(METAMASK_CONNECTED, this.metamaskUnlocked);
    emitter.on(ERROR, this.error);
  };

  componentWillUnmount() {
    emitter.removeListener(METAMASK_CONNECTED, this.metamaskUnlocked);
    emitter.removeListener(ERROR, this.error);
  };

  navigateInvest = () => {
    this.props.history.push('/invest')
  }

  unlockMetamask = () => {
    this.setState({ metamaskLoading: true })
    dispatcher.dispatch({ type: CONNECT_METAMASK, content: {} })
  }

  error = (err) => {
    this.setState({ loading: false, error: err })
  };

  metamaskUnlocked = () => {
    this.setState({ metamaskLoading: false })
    if(this.props.closeModal != null) {
      this.props.closeModal()
    }
    this.navigateInvest()
  }

  cancelMetamask = () => {
    this.setState({ metamaskLoading: false })
  }

  render() {
    const { classes } = this.props;
    const { metamaskLoading } = this.state;

    return (
      <div className={ classes.root }>
        <div className={ classes.contentContainer }>
          <Typography variant={ 'h3'}>Connect your wallet to use iswap finance</Typography>
          { metamaskLoading && this.renderMetamaskLoading() }
          { !metamaskLoading && this.renderOptions() }
        </div>
      </div>
    )
  };

  renderMetamaskLoading() {
    const { classes } = this.props;

    return (<div className={ classes.cardContainer }>
      <div className={ classes.metamask }>
      </div>
      <Typography variant='body1' className={ classes.instruction }>
        Click connect in the MetaMask notification window to connect your wallet to iswap finance.
      </Typography>
      <Button variant='contained' color='primary' onClick={ this.cancelMetamask } fullWidth>
        Cancel
      </Button>
    </div>)
  };

  renderOptions() {
    const { classes, closeModal } = this.props;

    return (
      <div className={ classes.cardContainer }>
        <Button className={ classes.unlockCard } variant='contained' color='secondary' onClick={ this.unlockMetamask } fullWidth>
          <div className={ classes.metamaskIcon }></div>
          <Typography className={ classes.buttonText } variant={ 'h3'}>Unlock using Metamask</Typography>
        </Button>
        <Button className={ classes.unlockCard } variant='contained' color='secondary' fullWidth>
          <div className={ classes.ledgerIcon }></div>
          <Typography className={ classes.buttonText } variant={ 'h3'}>Unlock using Ledger</Typography>
        </Button>
        { closeModal != null && <Button className={ classes.unlockCard } variant='text' color='secondary' onClick={ closeModal } fullWidth>
          <Typography className={ classes.buttonText } variant={ 'h3'}>Close</Typography>
        </Button>}
      </div>
    )
  };
}

/*

*/

export default withRouter(withStyles(styles)(Unlock));
