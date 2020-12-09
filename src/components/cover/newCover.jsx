import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid
} from '@material-ui/core';
import { colors } from '../../theme'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import * as moment from 'moment';

import {
  ERROR,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  CONFIGURE_COVER,
  CONFIGURE_COVER_RETURNED,
  GET_COVER_BALANCES,
  COVER_BALANCES_RETURNED,
  COVER_PURCHASE,
  COVER_PURCHASE_RETURNED
} from '../../constants'

import Loader from '../loader'
import Snackbar from '../snackbar'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  root: {
    flex: 1,
    width: '100%',
    marginTop: '60px',
    maxWidth: '1000px',
  },
  coverList: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center'
  },
  flexy: {
    width: '100%',
    display: 'flex'
  },
  label: {
    flex: 1,
    paddingLeft: '12px',
    paddingBottom: '6px',
  },
  valContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: '100%',
    marginBottom: '40px',
  },
  balances: {
    textAlign: 'right',
    paddingRight: '20px',
  },
  actionInput: {
    background: colors.white
  },
  assetSelectIcon: {
    marginRight: '24px',
    width: '30px',
    display: 'flex'
  },
  claimOptionContainer: {
    display: 'flex',
    flex: 1,
    minWidth: '100%',
    marginBottom: '40px',
    flexWrap: 'wrap'
  },
  claimOption: {
    border: '1px solid '+colors.borderBlue,
    borderRadius: '50px',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: '12px',
    paddingBottom: '24px',
    filter: 'grayscale(100%)',
    cursor: 'pointer',
    background: colors.white,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    '&:hover': {
      filter: 'grayscale(0%)',
      background: colors.lightGray,
      boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
    }
  },
  claimOptionSelected: {
    border: '1px solid '+colors.borderBlue,
    borderRadius: '50px',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: '12px',
    paddingBottom: '24px',
    cursor: 'pointer',
    background: colors.lightGray,
    boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
  },
  tokenTypeHeader: {
    margin: '24px 0px'
  },
  protocolLogo: {
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '100%',
    height: '250px',
    borderTopRightRadius: '50px',
    borderTopLeftRadius: '50px',
    borderBottom: '1px solid '+colors.borderBlue
  },
  claimStamp: {
    border: '3px solid '+colors.red,
    width: 'fit-content',
    padding: '12px',
    color: colors.red,
    position: 'absolute',
    opacity: 0.2,
    transform: 'scale(2) rotate(320deg) translate(-50%, -50%)',
    left: '50%',
    top: '50%',
  },
  noClaimStamp: {
    border: '3px solid '+colors.green,
    width: 'fit-content',
    padding: '12px',
    transform: 'rotate(320deg)',
    color: colors.green,
    position: 'absolute',
    marginTop: '80px',
    marginLeft: '2px'
  },
  claimDescription: {
    padding: '0px 48px 0px 48px',
    color: colors.darkGray
  },
  priceDescription: {
    color: colors.darkGray
  },
  pricesContainer: {
    display: 'flex',
    minWidth: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: '0px 12px'
  },
  priceContainer: {
    flex: 1,
    paddingBottom: '24px'
  },
  actionButton: {
    height: '47px'
  },
  disclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    lineHeight: '1.2',
    background: colors.white,
  },
  disclaimerContainer: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  assetSelectName: {
    display: 'flex',
    flex: 1,
    alignItems: 'center'
  },
  assetSelectBalance: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingLeft: '24px'
  },
  assetSelectMenu: {
    padding: '12px 24px'
  },
  padLeft: {
    marginLeft: '5px'
  }
});

class NewCover extends Component {

  constructor() {
    super()

    const account = store.getStore('account')

    this.state = {
      account: account,
      coverProtocols: store.getStore('coverProtocols'),
      coverCollateral: store.getStore('coverCollateral'),
      coverAssets: store.getStore('coverAssets'),
      loading: true,
      protocol: 'YEARN',
      assetAmount: '100',
      assetAmountError: false,
      claimOption: null,
      snackbarType: null,
      snackbarMessage: null,
    }

    dispatcher.dispatch({ type: CONFIGURE_COVER })
  }

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(CONFIGURE_COVER_RETURNED, this.configureCoverReturned);
    emitter.on(COVER_BALANCES_RETURNED, this.coverBalancesReturned);
    emitter.on(COVER_PURCHASE_RETURNED, this.showHash);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(CONFIGURE_COVER_RETURNED, this.configureCoverReturned);
    emitter.removeListener(COVER_BALANCES_RETURNED, this.coverBalancesReturned);
    emitter.removeListener(COVER_PURCHASE_RETURNED, this.showHash);
  };

  connectionConnected = () => {
    this.setState({
      account: store.getStore('account'),
      loading: true
    })

    dispatcher.dispatch({ type: GET_COVER_BALANCES })
  };

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account') })
  }

  configureCoverReturned = () => {

    const { account } = this.state

    this.setState({
      coverProtocols: store.getStore('coverProtocols'),
      loading: false
    })

    if(account && account.address) {
      dispatcher.dispatch({ type: GET_COVER_BALANCES })
    }
  }

  coverBalancesReturned = () => {
    this.setState({
      coverCollateral: store.getStore('coverCollateral'),
      coverAssets: store.getStore('coverAssets'),
      loading: false
    })
  }

  errorReturned = (error) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error' }
      that.setState(snackbarObj)
    })
  };

  showHash = (txHash) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  };

  render() {
    const { classes } = this.props
    const {
      loading,
      claimOption,
      assetAmount,
      protocol,
      snackbarMessage,
    } = this.state

    return (
      <div className={ classes.root }>
        <div className={ classes.valContainer }>
          <div className={ classes.flexy }>
            <div className={ classes.label }>
              <Typography variant='h4'>Select protocol</Typography>
            </div>
          </div>
          { this.renderProtocolSelect() }
        </div>
        { this.renderAssetInput() }
        <div className={ classes.claimOptionContainer }>
          <div className={ classes.flexy }>
            <div className={ classes.label }>
              <Typography variant='h4'>Purchase Claim or No Claim tokens</Typography>
            </div>
          </div>
          { this.renderClaim() }
          { this.renderNoClaim() }
        </div>
        <div className={ classes.valContainer }>
          <Button
            className={ classes.actionButton }
            variant="contained"
            color="primary"
            disabled={ loading || !protocol || !assetAmount || assetAmount === '' || assetAmount === '0' || isNaN(parseFloat(assetAmount)) }
            onClick={ this.onPurchase }
            fullWidth
            >
            <Typography className={ classes.buttonText } variant={ 'h5'}>
              { (!claimOption || isNaN(parseFloat(assetAmount))) && 'Purchase' }
              { claimOption && !isNaN(parseFloat(assetAmount)) && `Purchase ${parseFloat(assetAmount)} ${claimOption}` }
            </Typography>
          </Button>
        </div>
        <div className={ classes.disclaimerContainer }>
          <div className={ classes.disclaimer } style={{ marginTop: '25px', maxWidth: '500px' }}>
            <Grid container spacing={1}>
              <Grid item><VerifiedUserIcon fontSize="small" /></Grid>
              <Grid item xs>
                <Typography variant="h4" style={{ display: 'inline', fontWeight: 'bold' }}>
                CLAIMS
                </Typography>
              </Grid>
            </Grid>
            <Typography variant="body1">
              * To find out more about how claims are assessed and paid out, go to <a href="https://docs.coverprotocol.com/product/claims-guidelines" rel="noopener noreferrer" target="_blank">Cover Protocol's claim guidelines</a>
            </Typography>
          </div>
        </div>
        { loading && <Loader /> }
        { snackbarMessage && this.renderSnackbar() }
      </div>
    )
  };

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };

  renderProtocolSelect = () => {
    const { loading, coverProtocols, protocol } = this.state
    const { classes } = this.props

    return (
      <TextField
        id={ 'protocol' }
        name={ 'protocol' }
        select
        value={ protocol }
        onChange={ this.onSelectChange }
        variant="outlined"
        SelectProps={{
          native: false,
          variant:'outlined',
          className: classes.actionInput,
          renderValue: (option) => {
            return (
              <React.Fragment>
                <div className={ `${classes.assetSelectIcon} ${classes.padLeft}` }>
                  <img
                    alt=""
                    src={ this.getLogoForProtocol({ name: option }, true) }
                    height="30px"
                  />
                </div>
                <div className={ classes.assetSelectIconName }>
                  <Typography variant='h4'>{ option }</Typography>
                </div>
              </React.Fragment>
            )
          }
        }}
        fullWidth
        disabled={ loading }
        placeholder={ 'Select' }
      >
        { (coverProtocols && coverProtocols.length > 0) && coverProtocols.map((theProtocol) => { return this.renderProtocolOption(theProtocol) }) }
      </TextField>
    )
  }

  renderProtocolOption = (option) => {
    const { classes } = this.props
    return (
      <MenuItem key={ option.name } value={ option.name } className={ classes.assetSelectMenu }>
        <div className={ classes.assetSelectName}>
          <div className={ classes.assetSelectIcon }>
            <img
              alt=""
              src={ this.getLogoForProtocol(option, true) }
              height="30px"
            />
          </div>
          <div className={ classes.assetSelectIconName }>
            <Typography variant='h4'>{ option.name }</Typography>
          </div>
        </div>
        <div className={ classes.assetSelectBalance }>
          <Typography variant='h4'>${ option.noClaimPoolData && option.noClaimPoolData.liquidity ? option.noClaimPoolData.liquidity.toFixed(2) : '0.00' }</Typography>
          <Typography variant='h4' className={ classes.priceDescription }>No Claim Liquidity</Typography>
        </div>
        <div className={ classes.assetSelectBalance }>
          <Typography variant='h4'>${ option.claimPoolData && option.claimPoolData.liquidity ? option.claimPoolData.liquidity.toFixed(2) : '0.00' }</Typography>
          <Typography variant='h4' className={ classes.priceDescription }>Claim Liquidity</Typography>
        </div>
      </MenuItem>
    )
  }

  getLogoForProtocol = (protocol, isIcon) => {
    try {
      return require(`../../assets/cover/${protocol.name.toLowerCase()}_${isIcon ? "icon" : "logo"}.png`)
    } catch {
      return require('../../assets/unknown-logo.png')
    }
  }

  renderAssetInput = () => {
    const {
      classes
    } = this.props

    const {
      loading,
      assetAmount,
      assetAmountError,
      protocol,
      coverCollateral,
      coverProtocols
    } = this.state

    let selectedAsset = {}
    if(protocol && coverCollateral.length > 0) {

      let selectedProtocol = coverProtocols.filter((prot) => {
        return prot.name === protocol
      })

      if(selectedProtocol.length === 0) {
        return null
      } else {
        selectedProtocol = selectedProtocol[0]
      }

      selectedAsset = coverCollateral.filter((col) => {
        return col.address === selectedProtocol.purchaseCurrency
      })

      if(selectedAsset.length > 0) {
        selectedAsset = selectedAsset[0]
      } else {
        selectedAsset = {}
      }
    }

    return (
      <div className={ classes.valContainer }>
        <div className={ classes.flexy }>
          <div className={ classes.label }>
            <Typography variant='h4'>How many tokens would you like to buy</Typography>
          </div>
          <div className={ classes.balances }>
            <Typography variant='h4'>DAI Balance { selectedAsset.balance ? selectedAsset.balance.toFixed(4) : '0.0000' }</Typography>
          </div>        
        </div>
        <TextField
          fullWidth
          disabled={ loading }
          id={ 'assetAmount' }
          value={ assetAmount }
          error={ assetAmountError }
          onChange={ this.onChange }
          placeholder="0.00"
          variant="outlined"
          InputProps={{
            className: classes.actionInput,
            startAdornment: <div className={ classes.assetContainer }>
              <img
                alt=""
                src={ this.getLogo() }
                height="30px"
                className={ classes.assetSelectIcon }
              />
            </div>,
          }}
        />
      </div>
    )
  }

  getLogo = (symbol) => {
    let logo = null
    try {
      logo = require('../../assets/'+symbol+'-logo.png')
    } catch(ex) {
      logo = require('../../assets/unknown-logo.png')
    }

    return logo
  }

  // calculateTokensReceived = (amountToSell, feePercent, covTokenWeight, daiInPool, basePrice) => {
  //   const slippage = (1 - feePercent) / (2 * daiInPool * covTokenWeight);
  //   const totalSlippage = amountToSell * slippage;
  //   const endPrice = basePrice * (1 + totalSlippage);
  //   // better to underestimate than overestimate
  //   return (amountToSell / endPrice) * 0.98;
  // }

  calculateAmountNeeded = (amountWanted, feePercent, covTokenWeight, daiInPool, basePrice) => {
    const slippagePerUnit = (1 - feePercent) / (2 * daiInPool * covTokenWeight);
    const totalSlippage = amountWanted * basePrice * slippagePerUnit;
    return amountWanted > 0 ? ((amountWanted * basePrice) / (1 - totalSlippage) > 0 ? 1.015 * (amountWanted * basePrice) / (1 - totalSlippage) : Infinity) : 0;
  }

  renderClaim = () => {
    const {
      classes
    } = this.props

    const {
      assetAmount,
      protocol,
      coverProtocols,
      claimOption
    } = this.state

    if(!coverProtocols) {
      return null
    }

    let selectedProtocol = coverProtocols.filter((prot) => {
      return prot.name === protocol
    })

    if(selectedProtocol.length === 0) {
      return null
    } else {
      selectedProtocol = selectedProtocol[0]
    }
    const logo =  this.getLogoForProtocol(selectedProtocol, false)
    const tokensNeeded = this.calculateAmountNeeded(
      parseFloat(assetAmount), 
      selectedProtocol.claimPoolData.swapFee, 
      selectedProtocol.claimPoolData.covTokenWeight, 
      selectedProtocol.claimPoolData.daiInPool, 
      selectedProtocol.claimPoolData.price
      );

    return (
      <div className={ `${claimOption==='Claim Tokens'?classes.claimOptionSelected:classes.claimOption}` } onClick={ () => { tokensNeeded !== Infinity && this.selectClaimOption('Claim Tokens') } }>
        <div className={ classes.protocolLogo } style={{ backgroundImage: `url(${logo})` }}></div>
        <Typography variant='h2' color='primary' align='center' className={ classes.tokenTypeHeader }>Claim Tokens</Typography>
        <div className={ classes.pricesContainer }>
          <div className={ classes.priceContainer }>
            <Typography variant='h1' align='center' >${ selectedProtocol.claimPoolData.price ? (assetAmount && assetAmount !== '0' ? tokensNeeded / parseFloat(assetAmount) : selectedProtocol.claimPoolData.price).toFixed(2) : 'Unknown' }</Typography>
            <Typography variant='h4' align='center' className={ classes.priceDescription }>Token Price</Typography>
          </div>
          <div className={ classes.priceContainer }>
            <Typography variant='h1' align='center' >${ selectedProtocol.claimPoolData.price ? (tokensNeeded ? tokensNeeded.toFixed(2) : '0') : '0' }</Typography>
            <Typography variant='h4' align='center' className={ classes.priceDescription }>Est. Cost (DAI)</Typography>
          </div>
        </div>
        <div className={ classes.pricesContainer }>
          <div className={ classes.priceContainer }>
            <Typography variant='h3' align='center' >{ selectedProtocol.expires ? moment(selectedProtocol.expires*1e3).format("YYYY/MM/DD") : '' }</Typography>
            <Typography variant='h4' align='center' className={ classes.priceDescription }>Expiry Date</Typography>
          </div>
          <div className={ classes.priceContainer }>
            <Typography variant='h3' align='center' >${ selectedProtocol.claimPoolData && selectedProtocol.claimPoolData.liquidity ? selectedProtocol.claimPoolData.liquidity.toFixed(2) : '0.00' }</Typography>
            <Typography variant='h4' align='center' className={ classes.priceDescription }>Liquidity</Typography>
          </div>
        </div>
        <Typography variant='body2' className={ classes.claimDescription } align='center'>Claim tokens will pay out <b>1 {selectedProtocol.collateralName}*</b> for each token you hold in the event that there is a successful attack on the protocol before the expiry date.</Typography>
      </div>
    )
  }

  renderNoClaim = () => {
    const {
      classes
    } = this.props

    const {
      assetAmount,
      protocol,
      coverProtocols,
      claimOption
    } = this.state

    if(!coverProtocols) {
      return null
    }

    let selectedProtocol = coverProtocols.filter((prot) => {
      return prot.name === protocol
    })

    if(selectedProtocol.length === 0) {
      return null
    } else {
      selectedProtocol = selectedProtocol[0]
    }

    const logo =  this.getLogoForProtocol(selectedProtocol, false)
    const tokensNeeded = this.calculateAmountNeeded(
      parseFloat(assetAmount), 
      selectedProtocol.noClaimPoolData.swapFee, 
      selectedProtocol.noClaimPoolData.covTokenWeight, 
      selectedProtocol.noClaimPoolData.daiInPool, 
      selectedProtocol.noClaimPoolData.price
      );
    
    return (
      <div className={ `${claimOption==='No Claim Tokens'?classes.claimOptionSelected:classes.claimOption}` } onClick={ () => { tokensNeeded !== Infinity && this.selectClaimOption('No Claim Tokens') } }>
        <div className={ classes.protocolLogo } style={{ backgroundImage: `url(${logo})` }}></div>
        <Typography variant='h2' color='primary' align='center' className={ classes.tokenTypeHeader }>No Claim Tokens</Typography>
        <div className={ classes.pricesContainer }>
          <div className={ classes.priceContainer }>
            <Typography variant='h1' align='center' >${ selectedProtocol.noClaimPoolData.price ? (assetAmount && assetAmount !== '0' ? tokensNeeded / parseFloat(assetAmount) : selectedProtocol.noClaimPoolData.price).toFixed(2) : 'Unknown' }</Typography>
            <Typography variant='h4' align='center' className={ classes.priceDescription }>Token Price</Typography>
          </div>
          <div className={ classes.priceContainer }>
            <Typography variant='h1' align='center' >${ selectedProtocol.noClaimPoolData.price ? (tokensNeeded ? tokensNeeded.toFixed(2) : '0') : '0' }</Typography>
            <Typography variant='h4' align='center' className={ classes.priceDescription }>Est. Cost (DAI)</Typography>
          </div>
        </div>
        <div className={ classes.pricesContainer }>
          <div className={ classes.priceContainer }>
            <Typography variant='h3' align='center' >{ selectedProtocol.expires ? moment(selectedProtocol.expires*1e3).format("YYYY/MM/DD") : '' }</Typography>
            <Typography variant='h4' align='center' className={ classes.priceDescription }>Expiry Date</Typography>
          </div>
          <div className={ classes.priceContainer }>
            <Typography variant='h3' align='center' >${ selectedProtocol.noClaimPoolData && selectedProtocol.noClaimPoolData.liquidity ? selectedProtocol.noClaimPoolData.liquidity.toFixed(2) : '0.00' }</Typography>
            <Typography variant='h4' align='center' className={ classes.priceDescription }>Liquidity</Typography>
          </div>
        </div>
        <Typography variant='body2' className={ classes.claimDescription } align='center'>No Claim tokens will pay out <b>1 {selectedProtocol.collateralName}*</b> for each token you hold if there is no successful attack on the protocol by the expiry date.</Typography>
      </div>
    )
  }

  onSelectChange = (event) => {
    let val = []
    val[event.target.name] = event.target.value
    this.setState(val)
  }

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  selectClaimOption = (option) => {
    this.setState({ claimOption: option })
  }

  onPurchase = () => {
    const {
      coverProtocols,
      coverCollateral,
      protocol,
      assetAmount,
      claimOption
    } = this.state

    let selectedProtocol = coverProtocols.filter((prot) => {
      return prot.name === protocol
    })

    if(selectedProtocol.length === 0) {
      return null
    } else {
      selectedProtocol = selectedProtocol[0]
    }

    let asset = null
    let pool = null
    let purchaseAmount = null

    if(!claimOption) {
      return false
    } else if(claimOption === 'Claim Tokens') {
      asset = selectedProtocol.claimAsset
      pool = selectedProtocol.claimPoolData
      purchaseAmount = this.calculateAmountNeeded(
        parseFloat(assetAmount), 
        selectedProtocol.claimPoolData.swapFee, 
        selectedProtocol.claimPoolData.covTokenWeight, 
        selectedProtocol.claimPoolData.daiInPool, 
        selectedProtocol.claimPoolData.price
        ).toString()
    } else {
      asset = selectedProtocol.noClaimAsset
      pool = selectedProtocol.noClaimPoolData
      purchaseAmount = this.calculateAmountNeeded(
        parseFloat(assetAmount), 
        selectedProtocol.noClaimPoolData.swapFee, 
        selectedProtocol.noClaimPoolData.covTokenWeight, 
        selectedProtocol.noClaimPoolData.daiInPool, 
        selectedProtocol.noClaimPoolData.price
        ).toString()
    }

    let selectedPurchaseAsset = coverCollateral.filter((col) => {
      return col.address === selectedProtocol.purchaseCurrency
    })

    if(selectedPurchaseAsset.length > 0) {
      selectedPurchaseAsset = selectedPurchaseAsset[0]
    } else {
      selectedPurchaseAsset = {}
    }
    this.setState({ loading: true })
    dispatcher.dispatch({ type: COVER_PURCHASE, content: { amount: purchaseAmount, amountOut: parseFloat(assetAmount).toString(), asset: asset, collateral: selectedPurchaseAsset, pool: pool } })
  }

  balanceClicked = (asset) => {
    if(this.state.loading) {
      return
    }

    const balance = asset.balance
    const amount = Math.floor(balance*10000)/10000

    this.setState({ assetAmount: amount.toFixed(4) })
  }
}

export default withStyles(styles)(NewCover);
