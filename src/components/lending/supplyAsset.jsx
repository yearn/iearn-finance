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
    marginRight: '12px'
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

    const width = window.innerWidth

    return (
      <Accordion TransitionProps={{ unmountOnExit: true }} className={ classes.accordion } square key={ asset.symbol+"_expand" } expanded={ expanded === asset.symbol} onChange={ () => { this.handleChange(asset.symbol) } }>
        <AccordionSummary
          className={ classes.accordionSummary }
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <div className={ classes.assetSummary }>
            <div className={ classes.headingName }>
              <img
                alt=""
                src={ this.getLogo(asset.symbol) }
                height={ width > 600 ? '40px' : '30px' }
                className={ classes.assetIcon }
              />
              <Typography variant={ 'h4' } className={ classes.assetName } noWrap>{ asset.symbol }</Typography>
            </div>
            <div className={classes.headingAPY }>
              <Typography variant={ 'h4' } noWrap align='right'>{ asset.supplyAPY ? asset.supplyAPY.toFixed(2) : '0.00' }%</Typography>
            </div>
            <div className={classes.heading}>
              <Typography variant={ 'h4' } noWrap align='right'>{ asset.balance ? asset.balance.toFixed(2) : '0.00' } { asset.symbol }</Typography>
            </div>
            <div className={classes.heading}>
              <Typography variant={ 'h4' } noWrap align='right'>{ asset.supplyBalance ? asset.supplyBalance.toFixed(2) : '0.00' } { asset.symbol }</Typography>
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

    let theLimitUsed = (limitUsed)*100/limit

    if(asset.collateralEnabled) {
      if(supplyAmount && supplyAmount !== '') {
        theLimitUsed = (limitUsed-(supplyAmount*asset.price))*100/limit
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
              onKeyDown={ this.inputKeyDown }
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
                disabled={ loading || !supplyAmount || parseFloat(supplyAmount) >= asset.balance }
                onClick={ this.onSupply }
                fullWidth
                >
                <Typography className={ classes.buttonText } variant={ 'h5'}>
                  { asset.balance === 0 && 'No Balance to Supply' }
                  { asset.balance > 0 && supplyAmount && parseFloat(supplyAmount) > asset.balance && 'Insufficient Balance' }
                  { asset.balance > 0 && (!supplyAmount || parseFloat(supplyAmount) <= asset.balance) && 'Supply' }
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
                  { asset.supplyBalance > 0 && parseFloat(withdrawAmount) > asset.supplyBalance && 'Insufficient Balance' }
                  { asset.supplyBalance > 0 && (!withdrawAmount || parseFloat(withdrawAmount) <= asset.supplyBalance) && 'Withdraw' }
                </Typography>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  getLogo = (symbol) => {
    let logo = null
    try {
      logo = require('../../assets/'+symbol+'-logo.png')
    } catch(ex) {
      try {
        logo = require('../../assets/'+symbol+'-logo.jpg')
      } catch(ex) {
        try {
          logo = require('../../assets/'+symbol+'-logo.jpeg')
        } catch(ex) {
          try {
            logo = require('../../assets/'+symbol+'-logo.svg')
          } catch(ex) {
            logo = require('../../assets/unknown-logo.png')
          }
        }
      }
    }

    return logo
  }

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  inputKeyDown = (event) => {
    if (event.which === 13) {
      this.onInvest();
    }
  }

  onSupply = () => {
    this.setState({ supplyAmountError: false })

    const { supplyAmount } = this.state
    const { asset, startLoading } = this.props

    if(!supplyAmount || isNaN(supplyAmount) || supplyAmount <= 0 || supplyAmount > asset.balance) {
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

    if(!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount <= 0 || withdrawAmount > asset.supplyBalance) {
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

    const balance = asset.balance
    let amount = balance*percent/100

    this.setState({ supplyAmount: amount.toFixed(asset.decimals) })
  }

  setWithdrawAmount = (percent) => {
    if(this.state.loading) {
      return
    }

    const { asset } = this.props

    const balance = asset.supplyBalance
    let amount = balance*percent/100

    this.setState({ withdrawAmount: amount.toFixed(asset.decimals) })
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(SupplyAsset));
