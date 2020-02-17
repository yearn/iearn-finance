import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  InputAdornment
} from '@material-ui/core';

// import {
//   BALANCES_RETURNED
// } from '../../constants'

// import Store from "../../stores";
// const emitter = Store.emitter
// const dispatcher = Store.dispatcher
// const store = Store.store

const styles = theme => ({
  root: {
    padding: '0px 0px 24px 0px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: '100%'
  },
  inputCard: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  inputCardHeading: {
    width: '100%',
    padding: '12px 0px 12px 20px'
  },
  inputAdornment: {
    fontWeight: '600',
    fontSize: '1.5rem'
  },
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem'
  },

});

class Receiving extends Component {
  constructor() {
    super()

    this.state = {
      amount: '',
      amountError: false
    }
  }

  render() {
    const { classes, receiveAsset } = this.props;
    const {
      amount,
      amountError
    } = this.state;

    return (
      <div className={ classes.root }>
        <div className={ classes.inputCard }>
          <Typography variant='h3' className={ classes.inputCardHeading }>Receive amount</Typography>
          { this.renderAmountInput('amount', amount, amountError, 'Amount', '0.00', (receiveAsset ? receiveAsset.symbol : '')) }
        </div>
      </div>
    )
  };

  onChange = (event, value) => {
    let val = []
    val[event.target.name] = event.target.value
    this.setState(val)
  };

  renderAmountInput = (id, value, error, label, placeholder, inputAdornment) => {

    const { classes } = this.props
    const { loading } = this.state

    return (
      <TextField
        fullWidth
        className={ classes.actionInput }
        id={ id }
        name={ id }
        value={ value }
        error={ error }
        onChange={ this.onChange }
        disabled={ loading }
        placeholder={ placeholder }
        variant="outlined"
        disabled
        InputProps={{
          endAdornment: <InputAdornment position="end" className={ classes.inputAdornment }><Typography variant='h3'>{ inputAdornment }</Typography></InputAdornment>,
        }}
      />
    )
  }
}

export default withRouter(withStyles(styles)(Receiving));
