import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {  } from '@material-ui/core/styles';
import {
  DialogContent,
  Dialog,
  Slide,
  Typography,
  Button
} from '@material-ui/core';
import config from '../../config'

import {
  ERROR,
  INVEST_ALL,
  INVEST_ALL_RETURNED,
} from '../../constants'

import Loader from '../loader'
import InvestAllAsset from './investAllAsset'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store


function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => ({
  intro: {
    padding: '12px 0px',
    textAlign: 'center',
  },
  amountContainer: {
    padding: '12px 0px',
    // display: 'flex',
    // flexDirection: 'column'
  },
  actionsContainer: {
    padding: '12px 0px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  actionButton: {
    padding: '12px',
    minWidth: '120px',
    [theme.breakpoints.up('md')]: {
      padding: '15px',
      minWidth: '150px',
    }
  },
  scaleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 0px 12px 0px',
    alignItems: 'center',
    flexWrap: 'wrap',
    [theme.breakpoints.up('sm')]: {
      padding: '0px 12px 24px 12px',
    }
  },
  scale: {
    padding: '6px 12px',
    margin: '6px',
    [theme.breakpoints.up('sm')]: {
      padding: '12px 24px',
      margin: '12px',
    }
  },
  buttonText: {
    fontWeight: '700',
    color: 'white',
  },
});


class InvestAllModal extends Component {

  constructor() {
    super()

    this.state = {
      ethBalance: store.getStore('ethBalance'),
      account: store.getStore('account'),
    }
  }

  componentWillMount() {
    emitter.on(INVEST_ALL_RETURNED, this.investReturned);
    emitter.on(ERROR, this.errorReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(INVEST_ALL_RETURNED, this.investReturned);
    emitter.removeListener(ERROR, this.errorReturned);
  };

  investReturned = () => {
    this.setState({ loading: false })
    this.props.closeModal()
  };

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  render() {
    const { classes, closeModal, assets } = this.props;
    const {
      loading
    } = this.state

    const fullScreen = window.innerWidth < 450;

    return (
      <Dialog open={ true } onClose={ closeModal } fullWidth={ true } maxWidth={ 'sm' } TransitionComponent={ Transition } fullScreen={ fullScreen }>
        <DialogContent>
          <div className={ classes.amountContainer }>
            { assets ? assets.filter((asset) => {
                return asset.version !== 1
              }).filter((asset) => {
                return asset.version === 2 || (asset.version === 1 && (asset.investedBalance).toFixed(4) > 0)
              }).map((asset) => {
                return (
                  <InvestAllAsset asset={ asset } />
                )
              }) : null}
          </div>
          <div className={ classes.actionsContainer }>
            <Button
              className={ classes.actionButton }
              variant="text"
              color="secondary"
              disabled={ loading }
              onClick={ closeModal }
              >
              <Typography className={ classes.buttonText } variant={ 'h3'}>Cancel</Typography>
            </Button>
            <Button
              className={ classes.actionButton }
              variant="contained"
              color="primary"
              disabled={ loading }
              onClick={ this.onInvest }
              >
              <Typography className={ classes.buttonText } variant={ 'h3'} color='secondary'>Earn All</Typography>
            </Button>
          </div>
        </DialogContent>
        { loading && <Loader /> }
      </Dialog>
    )
  };

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

    const { amount, ethBalance } = this.state

    if(!amount || isNaN(amount) || amount <= 0 || amount > ethBalance) {
      this.setState({ amountError: true })
      return false
    }

    const asset = { iEarnContract: config.iEarnContract }

    this.setState({ loading: true })

    dispatcher.dispatch({ type: INVEST_ALL, content: { amount: amount, asset: asset } })
  }

  setAmount = (percent) => {

    if(this.state.loading) {
      return
    }

    const balance = store.getStore('ethBalance')
    let amount = balance*percent/100

    if(percent === 100) {
        amount = amount - 0.003
    }

    this.setState({ amount: amount.toFixed(8) })
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(InvestAllModal));
