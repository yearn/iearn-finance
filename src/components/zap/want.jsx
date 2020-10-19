import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  MenuItem,
  InputAdornment
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
  assetSelectPlus: {
    paddingLeft: '10px',
    paddingRight: '10px',
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
      curveContracts: props.curveContracts,
      assetOptions: [...props.assets, ...props.curveContracts],
      assetError: false
    }
  }

  componentWillReceiveProps(props) {
    if(props.assets && props.curveContracts) {

      const a = props.assets
      const b = props.curveContracts
      const assetOptions = [...a, ...b]
      const _asset = this.state.asset?this.state.asset:''

      this.setState({ assetOptions: assetOptions, assets: props.assets, curveContracts: props.curveContracts, asset: _asset })
    }
  }

  render() {
    const { classes, sendAsset, t, bestPrice, sendAmount } = this.props;
    const {
      assetOptions,
      asset
    } = this.state;

    let amount = null
    if(bestPrice && bestPrice.price > 0 && sendAmount && sendAmount > 0) {
      amount = (parseFloat(bestPrice.price) * parseFloat(sendAmount)).toFixed(4)
    }

    return (
      <div className={ classes.root }>
        <div className={ classes.inputCard }>

          <Typography variant='h3' className={ classes.inputCardHeading }>{ t("Zap.IWillReceive") }</Typography>
          { (sendAsset && sendAsset.symbol === 'ETH') && this.renderAsset('DAI', amount) }
          { (!sendAsset || sendAsset.symbol !== 'ETH') && this.renderAssetSelect('asset', asset, assetOptions, null, sendAsset) }
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
      asset = this.state.curveContracts.filter((contract) => { return contract.symbol === event.target.value })

      if(asset.length > 0) {
        asset = asset[0]
      } else {
        asset = null
      }
    }

    var that = this;
    setTimeout(() => {
      that.props.setReceiveAsset(asset)
    })
  };

  renderAsset = (id, amount) => {

    const { classes } = this.props

    return (
      <TextField
        id={ id }
        name={ id }
        value={ amount ? (amount + ' ' + id) : id }
        variant="outlined"
        disabled
        InputProps={{
          startAdornment: <InputAdornment position="start" className={ classes.inputAdornment }>
            <div className={ classes.assetSelectIcon }>
              <img
                alt=""
                src={ require('../../assets/'+(['crvV1', 'crvV2', 'crvV3', 'crvV3', 'crv'].includes(id) ? 'CRV' : id)+'-logo.png') }
                height="30px"
              />
            </div>
          </InputAdornment>,
        }}
      />
    )

  }

  renderAssetSelect = (id, value, options, error, sendAsset) => {

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
        { options ? options.filter((option) => {
            if(sendAsset && ['crvV1', 'crvV2'].includes(sendAsset.id)) {
              return ['crvV3'].includes(option.id) === true
            }
            if(sendAsset && ['crvV3'].includes(sendAsset.id)) {
              return ['crvV1', 'crvV2', 'crvV3', 'ETHv1', 'BUSDv3'].includes(option.id) === false
            }
            if(sendAsset && ['crvV4'].includes(sendAsset.id)) {
              return ['crvV1', 'crvV2', 'crvV3', 'crvV4', 'ETHv1', 'TUSDv2'].includes(option.id) === false
            }
            if(sendAsset && ['BUSDv3'].includes(sendAsset.id)) {
              return ['crvV4'].includes(option.id) === true
            }
            if(sendAsset && ['TUSDv2'].includes(sendAsset.id)) {
              return ['crvV3'].includes(option.id) === true
            }

            return ['crvV4', 'crvV3'].includes(option.id) === true
          }).map(this.renderAssetOption) : null }
      </TextField>
    )
  };

  renderAssetOption = (option) => {

    const { classes, sendAsset } = this.props
    return (
      <MenuItem key={ option.symbol } value={ option.symbol } className={ classes.assetSelectMenu }>
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
          {
            (sendAsset && sendAsset.id === 'crvV3' && option.id === 'crvV4') &&(
              <React.Fragment>
              <div className={ classes.assetSelectPlus }>
                <Typography variant='h4'>{ '+' }</Typography>
              </div>
              <div className={ classes.assetSelectIcon }>
                <img
                  alt=""
                  src={ require('../../assets/TUSD-logo.png') }
                  height="30px"
                />
              </div>
              <div className={ classes.assetSelectIconName }>
                <Typography variant='h4'>{ 'TUSD' }</Typography>
              </div>
            </React.Fragment>)
          }
        </React.Fragment>
      </MenuItem>
    )
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Want)));
