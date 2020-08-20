import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';

const styles = theme => ({
  value: {
    cursor: 'pointer'
  },
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem'
  },
  balances: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    cursor: 'pointer',
    zIndex: 999
  },
  tradeContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  sepperator: {
    borderBottom: '1px solid #E1E1E1',
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  scaleContainer: {
    width: '250px',
    display: 'flex',
    justifyContent: 'space-between',
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
  headingContainer: {
    width: '100%',
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    }
  },
  heading: {
    paddingBottom: '12px',
    flex: 1,
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    }
  },
  right: {
    textAlign: 'right'
  },
  symbol: {
    flex: 1
  },
  assetIcon: {
    display: 'flex',
    alignItems: 'center',
    verticalAlign: 'middle',
    borderRadius: '20px',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    cursor: 'pointer',
    marginRight: '20px',
    [theme.breakpoints.up('sm')]: {
      height: '40px',
      width: '40px',
      marginRight: '24px',
    }
  },
  headingName: {
    paddingTop: '5px',
    flex: 2,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    minWidth: '100%',
    [theme.breakpoints.up('sm')]: {
      minWidth: 'auto',
    }
  },
  amountContainer: {
    display: 'grid',
    position: 'relative'
  }
});


class Asset extends Component {

  constructor(props) {
    super()

    this.state = {
      amount: '',
      amountError: false,
      checked: false,
    }
  }

  render() {
    const { classes, asset } = this.props;
    const {
      amount,
      amountError,
      loading
    } = this.state

    const width = window.innerWidth

    return (
      <div className={ classes.tradeContainer }>
        <div className={classes.headingName}>
          <div className={ classes.assetIcon }>
            <img
              alt=""
              src={ require('../../assets/'+asset.symbol+'-logo.png') }
              height={ width > 600 ? '40px' : '30px'}
              style={asset.disabled?{filter:'grayscale(100%)'}:{}}
            />
          </div>
          <div>
            <Typography variant={ 'h3' }>{ asset.name }</Typography>
            <Typography variant={ 'h5' }>{ asset.version === 1?asset.description+' - v'+asset.version+'':asset.description }</Typography>
          </div>
        </div>
        <div className={ classes.amountContainer }>
          {!asset.disabled && <div className={ classes.balances }>
              <Typography variant='h3' className={ classes.title }></Typography><Typography variant='h4' onClick={ () => { this.setAmount(100) } } className={ classes.value } noWrap>{ 'Balance: '+ (asset.balance ? asset.balance.toFixed(4) : '0.0000') } { asset.tokenSymbol ? asset.tokenSymbol : asset.symbol }</Typography>
          </div>}
          <TextField
            fullWidth
            className={ classes.actionInput }
            id='amount'
            value={ amount }
            error={ amountError }
            onChange={ this.onChange }
            disabled={ loading || asset.disabled }
            label=""
            size="small"
            placeholder="0.00"
            variant="outlined"
          />
        </div>
      </div>)
  };

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  setAmount = (percent) => {

    if(this.state.loading) {
      return
    }

    const { asset } = this.props

    const balance = asset.balance
    let amount = balance*percent/100

    amount = Math.floor(amount*10000)/10000;
    this.setState({ amount: amount.toFixed(4) })
  }
}

export default withNamespaces()(withRouter(withStyles(styles, { withTheme: true })(Asset)));
