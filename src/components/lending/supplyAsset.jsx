import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch
} from '@material-ui/core';
import BigNumber from 'bignumber.js'
import ReactImageFallback from "react-image-fallback";

import {
  ERROR,
  LENDING_SUPPLY,
  LENDING_SUPPLY_RETURNED,
  LENDING_WITHDRAW,
  LENDING_WITHDRAW_RETURNED,
  LENDING_ENABLE_COLLATERAL,
  LENDING_ENABLE_COLLATERAL_RETURNED,
  LENDING_DISABLE_COLLATERAL,
  LENDING_DISABLE_COLLATERAL_RETURNED,
} from '../../constants'

import { colors } from '../../theme'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher

BigNumber.config({ ROUNDING_MODE: 1 })

const styles = theme => ({
  value: {
    cursor: 'pointer'
  },
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem'
  },
  balances: {
    width: '100%',
    textAlign: 'right',
    paddingRight: '20px',
    cursor: 'pointer'
  },
  accordion: {
    cursor: 'pointer',
    border: 'none',
    margin: '0px',
    borderRadius: '0px',
    borderBottom: '1px solid #dedede',
    "&:last-child": {
      borderBottom: 'none'
    }
  },
  accordionSummary: {
    padding: '0px 0px',
    width: '100%',
  },
  actionsContainer: {
    display: 'flex',
    flex: '1',
    padding: '24px 12px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  title: {
    paddingRight: '24px'
  },
  actionButton: {
    height: '47px'
  },
  tradeContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  sepperator: {
    borderBottom: '1px solid #E1E1E1',
    margin: '24px',
    [theme.breakpoints.up('sm')]: {
      width: '40px',
      borderBottom: 'none',
      margin: '0px'
    }
  },
  heading: {
    flex: 2,
  },
  headingCollateral: {
    width: '80px',
  },
  headingAPY: {
    flex: 1
  },
  headingName: {
    flex: 2,
    display: 'flex',
    alignItems: 'center'
  },
  buttons: {
    display: 'flex',
    width: '100%'
  },
  disabledContainer: {
    width: '100%',
    paddingTop: '12px',
    textAlign: 'center'
  },
  assetSummary: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    padding: '12px',
    width: '100%',
    flexWrap: 'wrap'
  },
  grey: {
    color: colors.darkGray
  },
  assetIcon: {
    marginRight: '12px',
    width: '30px',
    [theme.breakpoints.up('sm')]: {
      width: '40px',
    }
  },
  assetInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    padding: '12px',
    width: '100%',
    flexWrap: 'wrap'
  },
  infoField: {
    flex: 1,
    padding: '12px 0px',
  },
  assetActions: {
    width: '100%',
    background: '#dedede',
  },
  removePadding: {
    padding: '0px'
  },
  scaleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 0px 12px 0px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  scale: {
    minWidth: '10px',
    padding: '10px'
  },
  fullWidth: {
    minWidth: 'calc(100% - 24px)',
    margin: '0px 12px',
    borderBottom: '1px solid '+colors.borderBlue
  },
  assetSummarySectionheader: {
    width: '150px'
  },
  flexy: {
    padding: '6px 0px'
  }
});


class SupplyAsset extends Component {

  constructor() {
    super()

    this.state = {
      supplyAmount: '',
      supplyAmountError: false,
      withdrawAmount: '',
      withdrawAmountError: false,
      actionsOpen: false,
    }
  }

  componentWillMount() {
  }

  componentWillUnmount() {
    emitter.removeListener(LENDING_SUPPLY_RETURNED, this.supplyReturned);
    emitter.removeListener(LENDING_WITHDRAW_RETURNED, this.withdrawReturned);
    emitter.removeListener(LENDING_DISABLE_COLLATERAL_RETURNED, this.disableCollateralReturned);
    emitter.removeListener(LENDING_ENABLE_COLLATERAL_RETURNED, this.enableCollateralReturned);
    emitter.removeListener(ERROR, this.errorReturned);
  };

  supplyReturned = () => {
    emitter.removeListener(LENDING_SUPPLY_RETURNED, this.supplyReturned);
    this.setState({ loading: false, supplyAmount: '' })
  };

  withdrawReturned = (txHash) => {
    emitter.removeListener(LENDING_WITHDRAW_RETURNED, this.withdrawReturned);
    this.setState({ loading: false, withdrawAmount: '' })
  };

  enableCollateralReturned = (txHash) => {
    this.setState({ loading: false })
    emitter.removeListener(LENDING_ENABLE_COLLATERAL_RETURNED, this.enableCollateralReturned);
    emitter.removeListener(ERROR, this.errorReturned);
  };

  disableCollateralReturned = (txHash) => {
    this.setState({ loading: false })
    emitter.removeListener(LENDING_DISABLE_COLLATERAL_RETURNED, this.disableCollateralReturned);
    emitter.removeListener(ERROR, this.errorReturned);
  };

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  render() {
    const { classes, asset } = this.props;
    const {
      expanded
    } = this.state

    return (
      <Accordion TransitionProps={{ unmountOnExit: true }} className={ classes.accordion } square key={ asset.symbol+"_expand" } expanded={ expanded === asset.symbol} onChange={ () => { this.handleChange(asset.symbol) } }>
        <AccordionSummary
          className={ classes.accordionSummary }
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <div className={ classes.assetSummary }>
            <div className={ classes.headingName }>
              <ReactImageFallback
                src={ this.getLogo(asset.erc20address) }
                fallbackImage={ require('../../assets/unknown-logo.png') }
                alt=""
                className={ classes.assetIcon } />
              <Typography variant={ 'h4' } className={ classes.assetName } noWrap>{ asset.symbol }</Typography>
            </div>
            <div className={classes.headingAPY }>
              <Typography variant={ 'h4' } noWrap align='right'>{ asset.supplyAPY ? BigNumber(asset.supplyAPY).toFixed(2, BigNumber.ROUND_DOWN) : '0.00' }%</Typography>
            </div>
            <div className={classes.heading}>
              <Typography variant={ 'h4' } noWrap align='right'>{ asset.balance ? BigNumber(asset.balance).toFixed(2, BigNumber.ROUND_DOWN) : '0.00' } { asset.symbol }</Typography>
            </div>
            <div className={classes.heading}>
              <Typography variant={ 'h4' } noWrap align='right'>{ asset.supplyBalance ? BigNumber(asset.supplyBalance).toFixed(2, BigNumber.ROUND_DOWN) : '0.00' } { asset.symbol }</Typography>
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails className={ classes.removePadding }>
          { this._renderActions() }
        </AccordionDetails>
      </Accordion>
    )
  };

  handleChange = (id) => {
    this.setState({ expanded: this.state.expanded === id ? null : id })
  }

  handleCollateralChange = (event, newValue) => {
    const { asset, startLoading } = this.props

    this.setState({ loading: true })
    startLoading()

    if(newValue === true) {
      emitter.on(ERROR, this.errorReturned)
      emitter.on(LENDING_ENABLE_COLLATERAL_RETURNED, this.enableCollateralReturned)
      dispatcher.dispatch({ type: LENDING_ENABLE_COLLATERAL, content: { asset: asset } })
    } else {
      emitter.on(ERROR, this.errorReturned)
      emitter.on(LENDING_DISABLE_COLLATERAL_RETURNED, this.disableCollateralReturned)
      dispatcher.dispatch({ type: LENDING_DISABLE_COLLATERAL, content: { asset: asset } })
    }
  };

  _renderActions = () => {
    const { classes, asset, limit, limitUsed } = this.props;
    const {
      supplyAmount,
      supplyAmountError,
      withdrawAmount,
      withdrawAmountError,
      loading,
    } = this.state

    let theLimitUsed = (limitUsed)*100/limit || 0

    if(asset.collateralEnabled) {
      if(supplyAmount && supplyAmount !== '' && limit !== 0) {
        theLimitUsed = limitUsed*100/(limit+(supplyAmount*asset.price*asset.collateralPercent/100))
      }
      if(withdrawAmount && withdrawAmount !== '') {
        theLimitUsed = limitUsed*100/(limit-(withdrawAmount*asset.price*asset.collateralPercent/100))
      }
    }

    return (
      <div className={ classes.assetActions }>
        <div className={ classes.assetInfo }>
          <div className={ classes.assetSummarySectionheader }>
            <Typography variant={ 'h4' } color='primary' noWrap>Supply { asset.symbol }</Typography>
          </div>
          <div className={ classes.infoField }>
            <Typography variant={ 'h5' } className={ classes.grey }>Borrow limit:</Typography>
            <div className={ classes.flexy }>
              <Typography variant={ 'h3' } noWrap>$ { limit ? limit.toFixed(2) : '0.00' }</Typography>
            </div>
          </div>
          <div className={ classes.infoField }>
            <Typography variant={ 'h5' } className={ classes.grey }>Borrow limit used:</Typography>
            <div className={ classes.flexy }>
              <Typography variant={ 'h3' } noWrap>{ theLimitUsed.toFixed(2) }%</Typography>
            </div>
          </div>
          <div>
            <Typography variant={ 'h5' } className={ classes.grey }>Collateral:</Typography>
            <Switch
              color='primary'
              checked={ asset.collateralEnabled }
              onChange={ this.handleCollateralChange }
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </div>
        </div>
        <div className={ classes.fullWidth }></div>
        <div className={ classes.actionsContainer }>
          <div className={ classes.tradeContainer }>
            <div className={ classes.balances }>
              <Typography variant='h4' onClick={ () => { this.setSupplyAmount(100) } } className={ classes.value } noWrap>{ 'Wallet: '+ (asset.balance ? (Math.floor(asset.balance*10000)/10000).toFixed(4) : '0.0000') } { asset.symbol }</Typography>
            </div>
            <TextField
              fullWidth
              className={ classes.actionInput }
              id='supplyAmount'
              value={ supplyAmount }
              error={ supplyAmountError }
              onChange={ this.onChange }
              disabled={ loading }
              placeholder="0.00"
              variant="outlined"
            />
            <div className={ classes.scaleContainer }>
              <Button
                className={ classes.scale }
                variant='text'
                disabled={ loading }
                color="primary"
                onClick={ () => { this.setSupplyAmount(25) } }>
                <Typography variant={'h5'}>25%</Typography>
              </Button>
              <Button
                className={ classes.scale }
                variant='text'
                disabled={ loading }
                color="primary"
                onClick={ () => { this.setSupplyAmount(50) } }>
                <Typography variant={'h5'}>50%</Typography>
              </Button>
              <Button
                className={ classes.scale }
                variant='text'
                disabled={ loading }
                color="primary"
                onClick={ () => { this.setSupplyAmount(75) } }>
                <Typography variant={'h5'}>75%</Typography>
              </Button>
              <Button
                className={ classes.scale }
                variant='text'
                disabled={ loading }
                color="primary"
                onClick={ () => { this.setSupplyAmount(100) } }>
                <Typography variant={'h5'}>100%</Typography>
              </Button>
            </div>
            <div className={ classes.buttons }>
              <Button
                className={ classes.actionButton }
                variant="contained"
                color="primary"
                disabled={ loading || !supplyAmount || BigNumber(supplyAmount).gt(BigNumber(asset.balance)) }
                onClick={ this.onSupply }
                fullWidth
                >
                <Typography className={ classes.buttonText } variant={ 'h5'}>
                  { asset.balance === 0 && 'No Balance to Supply' }
                  { asset.balance > 0 && supplyAmount && BigNumber(supplyAmount).gt(BigNumber(asset.balance)) && 'Insufficient Balance' }
                  { asset.balance > 0 && (!supplyAmount || BigNumber(supplyAmount).lte(BigNumber(asset.balance))) && 'Supply' }
                </Typography>
              </Button>
            </div>
          </div>
          <div className={ classes.sepperator }></div>
          <div className={classes.tradeContainer}>
            <div className={ classes.balances }>
              <Typography variant='h4' onClick={ () => { this.setWithdrawAmount(100) } }  className={ classes.value } noWrap>{ 'Protocol: ' + (asset.supplyBalance ? (Math.floor(asset.supplyBalance*10000)/10000).toFixed(4) : '0.0000') } { asset.symbol }</Typography>
            </div>
            <TextField
              fullWidth
              className={ classes.actionInput }
              id='withdrawAmount'
              value={ withdrawAmount }
              error={ withdrawAmountError }
              onChange={ this.onChange }
              disabled={ loading }
              placeholder="0.00"
              variant="outlined"
              onKeyDown={ this.inputRedeemKeyDown }
            />
            <div className={ classes.scaleContainer }>
              <Button
                className={ classes.scale }
                variant='text'
                disabled={ loading }
                color="primary"
                onClick={ () => { this.setWithdrawAmount(25) } }>
                <Typography variant={'h5'}>25%</Typography>
              </Button>
              <Button
                className={ classes.scale }
                variant='text'
                disabled={ loading }
                color="primary"
                onClick={ () => { this.setWithdrawAmount(50) } }>
                <Typography variant={'h5'}>50%</Typography>
              </Button>
              <Button
                className={ classes.scale }
                variant='text'
                disabled={ loading }
                color="primary"
                onClick={ () => { this.setWithdrawAmount(75) } }>
                <Typography variant={'h5'}>75%</Typography>
              </Button>
              <Button
                className={ classes.scale }
                variant='text'
                disabled={ loading }
                color="primary"
                onClick={ () => { this.setWithdrawAmount(100) } }>
                <Typography variant={'h5'}>100%</Typography>
              </Button>
            </div>
            <div className={ classes.buttons }>
              <Button
                className={ classes.actionButton }
                variant="contained"
                color="primary"
                disabled={ loading || asset.supplyBalance === 0 || !withdrawAmount || parseFloat(withdrawAmount) > asset.supplyBalance }
                onClick={ this.onWithdraw }
                fullWidth
                >
                <Typography className={ classes.buttonText } variant={ 'h5'} >
                  { asset.supplyBalance === 0 && 'No Balance to Withdraw' }
                  { asset.supplyBalance > 0 && BigNumber(withdrawAmount).gt(BigNumber(asset.supplyBalance)) && 'Insufficient Balance' }
                  { asset.supplyBalance > 0 && (!withdrawAmount || BigNumber(withdrawAmount).lte(BigNumber(asset.supplyBalance))) && 'Withdraw' }
                </Typography>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  getLogo = (address) => `https://raw.githubusercontent.com/iearn-finance/yearn-assets/master/icons/tokens/${address}/logo-128.png`

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  onSupply = () => {
    this.setState({ supplyAmountError: false })

    const { supplyAmount } = this.state
    const { asset, startLoading } = this.props

    if(!supplyAmount || isNaN(supplyAmount) || supplyAmount <= 0) {
      this.setState({ supplyAmountError: true })
      return false
    }

    this.setState({ loading: true })
    startLoading()

    emitter.on(ERROR, this.errorReturned)
    emitter.on(LENDING_SUPPLY_RETURNED, this.supplyReturned);
    dispatcher.dispatch({ type: LENDING_SUPPLY, content: { amount: supplyAmount, asset: asset } })
  }

  onWithdraw = () => {
    this.setState({ withdrawAmountError: false })

    const { asset, startLoading  } = this.props
    let withdrawAmount = this.state.withdrawAmount

    if(!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      this.setState({ withdrawAmountError: true })
      return false
    }

    this.setState({ loading: true })
    startLoading()

    emitter.on(ERROR, this.errorReturned)
    emitter.on(LENDING_WITHDRAW_RETURNED, this.withdrawReturned);
    dispatcher.dispatch({ type: LENDING_WITHDRAW, content: { amount: withdrawAmount, asset: asset } })
  }

  setSupplyAmount = (percent) => {
    if(this.state.loading) {
      return
    }

    const { asset } = this.props
    const amount = BigNumber(asset.balance).times(percent).div(100).toFixed(asset.decimals)

    this.setState({ supplyAmount: amount })
  }

  setWithdrawAmount = (percent) => {
    if(this.state.loading) {
      return
    }

    const { asset } = this.props

    const amount = BigNumber(asset.supplyBalance).times(percent).div(100).toFixed(asset.decimals)

    this.setState({ withdrawAmount: amount })
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(SupplyAsset));
