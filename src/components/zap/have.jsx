import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  MenuItem,
  TextField
} from '@material-ui/core';

import { withNamespaces } from 'react-i18next';
import { colors } from '../../theme'

import Store from "../../stores";
// const emitter = Store.emitter
// const dispatcher = Store.dispatcher
const store = Store.store

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
    paddingLeft: '20px',
    color: colors.darkGray
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
    width: '100%',
    textAlign: 'right',
    paddingRight: '20px',
    cursor: 'pointer'
  },
  title: {
    paddingRight: '24px'
  },

});

class Have extends Component {
  constructor(props) {
    super()

    // const a = props.assets.filter((asset) => { return asset.balance > 0 })
    // const b = props.curveContracts.filter((asset) => { return asset.balance > 0 })

    const a = props.assets
    const b = props.curveContracts

    this.state = {
      asset: '',
      assets: props.assets,
      curveContracts: props.curveContracts,
      assetOptions: [...a, ...b],
      assetError: false,
    }
  }

  componentWillReceiveProps(props) {
    if(props.assets && props.curveContracts) {
      const _asset = this.state.asset?this.state.asset:props.assets[0].symbol
      // const a = props.assets.filter((asset) => { return asset.balance > 0 })
      // const b = props.curveContracts.filter((asset) => { return asset.balance > 0 })

      const a = props.assets
      const b = props.curveContracts

      this.setState({ assetOptions: [...a, ...b], assets: props.assets, curveContracts: props.curveContracts, asset: _asset })
    }
  }

  render() {
    const { classes, sendAsset, t } = this.props;
    const {
      asset,
      assetOptions,
      assetError
    } = this.state;

    return (
      <div className={ classes.root }>
        <div className={ classes.inputCard }>
          <Typography variant='h3' className={ classes.inputCardHeading }>{ t("Zap.IHave") }</Typography>
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
    } else {
      asset = this.state.curveContracts.filter((contract) => { return contract.symbol === event.target.value })

      if(asset.length > 0) {
        asset = asset[0]
      } else {
        asset = {
          id: 'crvV4',
          name: 'Curve.fi yDAI+yUSDC+yUSDT+yTUSD',
          symbol: 'Curve.fi V4',
          balance: store.getStore('curvBalance')
        }
      }
    }

    var that = this;
    setTimeout(() => {
      that.props.setSendAsset(asset)
    })

  };

  renderAssetSelect = (id, value, options, error) => {

    const { loading, classes } = this.props

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
        className={ classes.assetSelectRoot }
      >
        { /* this.renderAssetOption('CRV') */ }
        { options ? options.map(this.renderAssetOption) : null }
      </TextField>
    )
  };

  renderAssetOption = (option) => {

    const { classes } = this.props

    return (
      <MenuItem key={option.id} value={option.symbol} className={ classes.assetSelectMenu }>
        <React.Fragment>
          <div className={ classes.assetSelectIcon }>
            <img
              alt=""
              src={ require('../../assets/'+(['crvV1', 'crvV2', 'crvV3', 'crvV4'].includes(option.id) ? 'CRV' : option.symbol)+'-logo.png') }
              height="30px"
            />
          </div>
          <div className={ classes.assetSelectIconName }>
            <Typography variant='h4'>{ option.symbol }</Typography>
          </div>
        </React.Fragment>
      </MenuItem>
    )
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Have)));
