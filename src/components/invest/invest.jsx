import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';

import Collateral from './collateral'
import Invested from './invested'

// import Store from "../../stores";
// const emitter = Store.emitter
// const dispatcher = Store.dispatcher
// const store = Store.store

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    maxWidth: '1280px',
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
