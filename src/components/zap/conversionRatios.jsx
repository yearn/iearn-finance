import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography
} from '@material-ui/core';


const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
});

class ConversionRatios extends Component {
  constructor() {
    super()

    this.state = {

    }
  }

  render() {
    const { classes, bestPrice, sendAsset, receiveAsset } = this.props;

    return (
      <div className={ classes.root }>
        <Typography>Current Price: 1 { sendAsset.symbol } = { bestPrice.price ? parseFloat(bestPrice.price).toFixed(4) : '0' } { receiveAsset.symbol } </Typography>
      </div>
    )
  };
}

export default withRouter(withStyles(styles)(ConversionRatios));
