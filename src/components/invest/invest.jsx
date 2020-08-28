import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';

import Collateral from './collateral'
import Invested from './invested'

import {
  GET_PRICES,
  GET_VAULT_VALUES
} from '../../constants'

import Store from "../../stores";
// const emitter = Store.emitter
const dispatcher = Store.dispatcher
// const store = Store.store

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    maxWidth: '1200px',
    width: '100%'
  },
  collateralContainer: {
    flex: 1,
    display: 'flex',
  },
  seperatorontainer: {
    width: '0px',
    borderRight: '1px solid #aaa'
  },
  investedContainer: {
    flex: 1,
    display: 'flex',
  }
});

class Invest extends Component {

  componentWillMount() {
    dispatcher.dispatch({ type: GET_PRICES, content: {} })
    dispatcher.dispatch({ type: GET_VAULT_VALUES, content: {} })
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={ classes.root }>
        <div className={ classes.collateralContainer }>
          <Collateral />
        </div>
        <div className={ classes.seperatorontainer }></div>
        <div className={ classes.investedContainer }>
          <Invested />
        </div>
      </div>
    )
  };
}

export default withRouter(withStyles(styles)(Invest));
