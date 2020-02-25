import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  MenuItem,
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
  assetSelectRoot: {
    borderRadius: '1.25rem'
  },
  assetSelectMenu: {
    padding: '15px 15px 15px 20px',
    minWidth: '200px',
  },
  assetSelectIcon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    borderRadius: '25px',
    background: '#dedede',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    cursor: 'pointer'
  },
  assetSelectIconName: {
    paddingLeft: '10px',
    display: 'inline-block',
    verticalAlign: 'middle'
  }

});

class Want extends Component {
  constructor(props) {
    super()

    this.state = {
      asset: '',
      assets: props.assets,
    }
  }

  render() {
    const { classes, receiveAsset } = this.props;

    return (
      <div className={ classes.root }>
        <div className={ classes.inputCard }>
          <Typography variant='h3' className={ classes.inputCardHeading }>I will receive</Typography>
          { (!receiveAsset) && this.renderAsset('') }
          { (receiveAsset) && this.renderAsset('DAI') }
        </div>
      </div>
    )
  };

  onChange = (event, value) => {
    let val = []
    val[event.target.name] = event.target.value
    this.setState(val)

    let asset = this.state.assets.filter((asset) => { return asset.symbol === event.target.value})

    if(asset.length > 0) {
      asset = asset[0]
    } else {
      asset = null
    }

    this.props.setReceiveAsset(asset)
  };

  renderAsset = (id) => {
    const { receiveAsset } = this.props;
    var value = id
    if (receiveAsset&&receiveAsset.balance) {
      const balance = receiveAsset.balance * 0.85;
      value = balance + ' $Curve.fi'
    }
    return (
      <TextField
        id={ id }
        name={ id }
        value={ value }
        variant="outlined"
        disabled
      />
    )
  }

  renderAssetSelect = (id, value, options, error) => {

    const { loading } = this.props

    return (
      <TextField
        id={ id }
        name={ id }
        select
        value={ value }
        onChange={ this.onChange }
        SelectProps={{
          native: false,
        }}
        variant="outlined"
        disabled={ loading }
      >
        { options ? options.map(this.renderAssetOption) : null }
      </TextField>
    )
  };

  renderAssetOption = (option) => {

    const { classes } = this.props

    return (
      <MenuItem key={option} value={option} className={ classes.assetSelectMenu }>
        <React.Fragment>
          <div className={ classes.assetSelectIcon }>
            <img
              alt=""
              src={ require('../../assets/'+(['CurveV1', 'CurveV2', 'CurveV3'].includes(option) ? 'CRV' : option)+'-logo.png') }
              height="30px"
            />
          </div>
          <div className={ classes.assetSelectIconName }>
            <Typography variant='h2'>{ option }</Typography>
          </div>
        </React.Fragment>
      </MenuItem>
    )
  }
}

export default withRouter(withStyles(styles)(Want));
