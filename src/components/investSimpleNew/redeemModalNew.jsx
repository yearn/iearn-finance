import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  DialogContent,
  Dialog,
  Slide,
  Typography,
  TextField,
  Button
} from '@material-ui/core';

import {
  ERROR,
  REDEEM,
  REDEEM_RETURNED,
} from '../../constants'
import config from '../../config'

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
  }
});


class RedeemModal extends Component {

  constructor() {
    super()

    this.state = {
      iEthBalance: store.getStore('iEthBalance'),
      amount: '',
      amountError: false,
      account: store.getStore('account'),
    }
  }

  componentWillMount() {
    emitter.on(REDEEM_RETURNED, this.redeemReturned);
    emitter.on(ERROR, this.errorReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(REDEEM_RETURNED, this.redeemReturned);
    emitter.removeListener(ERROR, this.errorReturned);
  };

  redeemReturned = () => {
    this.setState({ loading: false })
    this.props.closeModal()
  };

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  render() {
    const { classes, closeModal } = this.props;
    const {
      amount,
      amountError,
      loading
    } = this.state

    const fullScreen = window.innerWidth < 450;

    return (
      <Dialog open={ true } onClose={ closeModal } fullWidth={ true } maxWidth={ 'sm' } TransitionComponent={ Transition } fullScreen={ fullScreen }>
        <DialogContent>
          <div className={ classes.intro }>
            <Typography variant='h3'>Tell us how much iEth you would like to redeem. Once you press submit, you will need to approve the transaction in MetaMask.</Typography>
          </div>
          <div className={ classes.amountContainer }>
            <TextField
              fullWidth
              className={ classes.actionInput }
              id='amount'
              value={ amount }
              error={ amountError }
              onChange={ this.onChange }
              disabled={ loading }
              label="Redeem Amount"
              placeholder="0.00"
              variant="outlined"
              onKeyDown={ this.inputKeyDown }
              helperText={ 'Keep in mind, you need some Ether for transaction fees' }
            />
          </div>
          <div className={ classes.scaleContainer }>
            <Button
              className={ classes.scale }
              variant='contained'
              disabled={ loading }
              color="primary"
              onClick={ () => { this.setAmount(25) } }>
              <Typography color='secondary'>25%</Typography>
            </Button>
            <Button
              className={ classes.scale }
              variant='contained'
              disabled={ loading }
              color="primary"
              onClick={ () => { this.setAmount(50) } }>
              <Typography color='secondary'>50%</Typography>
            </Button>
            <Button
              className={ classes.scale }
              variant='contained'
              disabled={ loading }
              color="primary"
              onClick={ () => { this.setAmount(75) } }>
              <Typography color='secondary'>75%</Typography>
            </Button>
            <Button
              className={ classes.scale }
              variant='contained'
              disabled={ loading }
              color="primary"
              onClick={ () => { this.setAmount(100) } }>
              <Typography color='secondary'>100%</Typography>
            </Button>
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
              onClick={ this.onRedeem }
              >
              <Typography className={ classes.buttonText } variant={ 'h3'} color='secondary'>Submit</Typography>
            </Button>
          </div>
        </DialogContent>
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
      this.onRedeem();
    }
  }

  onRedeem = () => {
    this.setState({ amountError: false })

    const { amount, ethBalance } = this.state

    if(!amount || isNaN(amount) || amount <= 0 || amount > ethBalance) {
      this.setState({ amountError: true })
      return false
    }

    const asset = { iEarnContract: config.iEarnContract }

    this.setState({ loading: true })

    dispatcher.dispatch({ type: REDEEM, content: { amount: amount, asset: asset } })
  }

  setAmount = (percent) => {

    if(this.state.loading) {
      return
    }

    const balance = store.getStore('iEthBalance')
    let amount = balance*percent/100

    this.setState({ amount: amount.toFixed(8) })
  }
}

export default withRouter(withStyles(styles)(RedeemModal));
