import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  DialogContent,
  Dialog,
  Slide,
  Typography,
  Card,
  TextField,
  Button
} from '@material-ui/core';

import {
  ERROR,
  INVEST,
  INVEST_RETURNED,
} from '../../constants'

import Loader from '../loader'

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
    cursor: 'pointer',
    background: '#aaa',
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    '&:hover': {
      boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
    },
    [theme.breakpoints.up('sm')]: {
      padding: '12px 24px',
      margin: '12px',
    }
  }
});


class InvestModal extends Component {

  constructor() {
    super()

    this.state = {
      ethBalance: store.getStore('ethBalance'),
      amount: '',
      amountError: false,
      account: store.getStore('account'),
    }
  }

  componentWillMount() {
    emitter.on(INVEST_RETURNED, this.investReturned);
    emitter.on(ERROR, this.errorReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(INVEST_RETURNED, this.investReturned);
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
    const { classes, theme, closeModal } = this.props;
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
            <Typography variant='h3'>Awesome, tell us how much Eth you would like to invest. Once you press submit, you will need to approve the transaction in MetaMask and you will be earning interest on your Eth.</Typography>
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
              label="Invest Amount"
              placeholder="0.00"
              variant="outlined"
              onKeyDown={ this.inputKeyDown }
              helperText={ 'Keep in mind, you need some Ether for transaction fees' }
            />
          </div>
          <div className={ classes.scaleContainer }>
            <div className={ classes.scale } onClick={ () => { this.setAmount(25) } }><Typography>25%</Typography></div>
            <div className={ classes.scale } onClick={ () => { this.setAmount(50) } }><Typography>50%</Typography></div>
            <div className={ classes.scale } onClick={ () => { this.setAmount(75) } }><Typography>75%</Typography></div>
            <div className={ classes.scale } onClick={ () => { this.setAmount(100) } }><Typography>MAX</Typography></div>
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
              color="secondary"
              disabled={ loading }
              onClick={ this.onInvest }
              >
              <Typography className={ classes.buttonText } variant={ 'h3'}>Submit</Typography>
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

    const asset = { iEarnContract: '0xdfF329030357Ce6a8844D774302266F9f69f90E6' }

    this.setState({ loading: true })

    dispatcher.dispatch({ type: INVEST, content: { amount: amount, asset: asset } })
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

export default withRouter(withStyles(styles, { withTheme: true })(InvestModal));
