import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  InputAdornment,
  Button
} from '@material-ui/core';
import { colors } from '../../theme'

import { withNamespaces } from 'react-i18next';
// import {
//   BALANCES_RETURNED
// } from '../../constants'

// import Store from "../../stores";
// const emitter = Store.emitter
// const dispatcher = Store.dispatcher
// const store = Store.store

const styles = theme => ({
  root: {
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
    padding: '12px 0px 12px 20px',
    color: colors.darkGray
  },
  inputAdornment: {
    fontWeight: '600',
    fontSize: '1.5rem'
  },
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem'
  },
  scaleContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '0px 0px 12px 0px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  scale: {
    minWidth: '10px'
  },
  buttonText: {
    fontWeight: '700',
  },

});

class Sending extends Component {
  constructor() {
    super()

    this.state = {
      loading: false
    }
  }

  render() {
    const { classes, sendAsset, sendAmount, loading, t } = this.props;

    return (
      <div className={ classes.root }>
        <div className={ classes.inputCard }>
          <Typography variant='h3' className={ classes.inputCardHeading }>{ t("Zap.SendAmount") }</Typography>
          { this.renderAmountInput('amount', sendAmount, false, 'Amount', '0.00', (sendAsset ? sendAsset.symbol : '')) }
          <div className={ classes.scaleContainer }>
            <Button
              className={ classes.scale }
              variant='text'
              disabled={ loading }
              color="primary"
              onClick={ () => { this.props.setSendAmountPercent(25) } }>
              <Typography variant={'h5'}>25%</Typography>
            </Button>
            <Button
              className={ classes.scale }
              variant='text'
              disabled={ loading }
              color="primary"
              onClick={ () => { this.props.setSendAmountPercent(50) } }>
              <Typography variant={'h5'}>50%</Typography>
            </Button>
            <Button
              className={ classes.scale }
              variant='text'
              disabled={ loading }
              color="primary"
              onClick={ () => { this.props.setSendAmountPercent(75) } }>
              <Typography variant={'h5'}>75%</Typography>
            </Button>
            <Button
              className={ classes.scale }
              variant='text'
              disabled={ loading }
              color="primary"
              onClick={ () => { this.props.setSendAmountPercent(100) } }>
              <Typography variant={'h5'}>100%</Typography>
            </Button>
          </div>
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

    const { classes, loading } = this.props

    return (
      <TextField
        fullWidth
        className={ classes.actionInput }
        id={ id }
        name={ id }
        value={ value }
        error={ error }
        onChange={ (e) => { this.props.setSendAmount(e.target.value) } }
        disabled={ loading }
        placeholder={ placeholder }
        variant="outlined"
        InputProps={{
          endAdornment: <InputAdornment position="end" className={ classes.inputAdornment }><Typography variant='h3'>{ inputAdornment }</Typography></InputAdornment>,
        }}
      />
    )
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Sending)));
