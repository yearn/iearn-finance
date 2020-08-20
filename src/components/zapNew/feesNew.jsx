import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { } from '@material-ui/core';


const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
});

class Fees extends Component {
  constructor() {
    super()

    this.state = {

    }
  }

  render() {
    const { classes } = this.props;
    const {
      asset,
      assetOptions,
      assetError,
      amount,
      amountError
    } = this.state;

    return (
      <div className={ classes.root }>
      </div>
    )
  };
}

export default withRouter(withStyles(styles)(Fees));
