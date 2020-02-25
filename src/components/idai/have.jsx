import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  MenuItem,
  TextField
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
  },
  tradeContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 0px 12px 0px',
    alignItems: 'center'
  },
  balances: {
    marginBottom: '-25px',
    marginRight: '30px',
    zIndex: '900',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between'
  },
  title: {
    paddingRight: '24px'
  },

});

class Have extends Component {
  constructor(props) {
    super()

    const a = props.assets.filter((asset) => { return asset.balance > 0 }).map((asset) => asset.symbol)

    this.state = {
      asset: '',
      assets: props.assets,
      assetOptions: [...a],
      assetError: false,
    }
  }

  componentWillReceiveProps(props) {
    if(props.assets) {
      const a = props.assets.filter((asset) => { return asset.balance > 0 }).map((asset) => asset.symbol)
      this.setState({ assetOptions: [...a], assets: props.assets, asset: props.assets[0].symbol })
    }
  }

  render() {
    const { classes, sendAsset } = this.props;
    const {
      asset,
      assetOptions,
      assetError
    } = this.state;

    return (
      <div className={ classes.root }>
        <div className={ classes.inputCard }>
          <Typography variant='h3' className={ classes.inputCardHeading }>I have</Typography>
          <div className={ classes.tradeContainer }>
            { sendAsset && <div className={ classes.balances }>
                <Typography variant='h3' className={ classes.title }></Typography><Typography variant='h4' onClick={ () => { this.props.setSendAmountPercent(100) } } className={ classes.value } noWrap>{ 'Balance: '+ ( sendAsset.balance ? sendAsset.balance.toFixed(4) : '0.0000') } { sendAsset.tokenSymbol ? sendAsset.tokenSymbol : sendAsset.symbol }</Typography>
            </div>}
            { this.renderAssetSelect('asset', asset, assetOptions, assetError) }
          </div>
        </div>
      </div>
    )
  };

  onChange = (event, value) => {
    let val = []
    val[event.target.name] = event.target.value
    this.setState(val)

    let asset = this.state.assets.filter((asset) => { return asset.symbol === event.target.value })

    if(asset.length > 0) {
      asset = asset[0]
    }

    this.props.setSendAsset(asset)
  };

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
        fullWidth
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

export default withRouter(withStyles(styles)(Have));
