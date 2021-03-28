import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Button, Slider, Grid, Tooltip
} from '@material-ui/core';

import {
  ERROR,
  DEPOSIT_CONTRACT,
  DEPOSIT_CONTRACT_RETURNED,
  WITHDRAW_BOTH,
  WITHDRAW_VAULT_RETURNED,
  DEPOSIT_ALL_CONTRACT,
  DEPOSIT_ALL_CONTRACT_RETURNED,
  WITHDRAW_BOTH_VAULT,
  WITHDRAW_BOTH_VAULT_RETURNED
} from '../../constants'

import { colors } from '../../theme'
import * as moment from 'moment';
import Store from "../../stores";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import InfoIcon from '@material-ui/icons/Info';
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  value: {
    cursor: 'pointer'
  },
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem',
    marginTop: '1rem'
  },
  balances: {
    width: '100%',
    textAlign: 'center',
    paddingRight: '20px',
    cursor: 'pointer'
  },
  vaultContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  actionsContainer: {
    paddingBottom: '12px',
    display: 'flex',
    flex: '1',
    padding: '24px',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      padding: '24px 12px',
    }
  },
  ratioContainer: {
    paddingBottom: '12px',
    display: 'flex',
    flex: '1',
    padding: '24px 0'
  },
  withdrawContainer: {
    paddingBottom: '12px',
    display: 'flex',
    flex: '1',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      display: 'block'
    }
  },
  title: {
    paddingRight: '24px'
  },
  actionButton: {
    height: '47px',
    margin: 'auto',
    borderRadius: '5px',
    background: '#18a0fb',
    color: '#ffffff',
    width: '49%',
    '&:hover': {
      background: '#00c2ff'
    }
  },
  withdrawButton: {
    height: '47px',
    margin: 'auto',
    borderRadius: '5px',
    background: '#cccccc',
    color: '#222222',
    width: '49%'
  },
  leftLabelContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  rightLabelContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  tradeContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '80%',
    margin: 'auto',
    marginBottom: '1.5rem',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    }
  },
  sepperator: {
    borderBottom: '1px solid #E1E1E1',
    margin: '24px -24px',
    // [theme.breakpoints.up('sm')]: {
    //   width: '40px',
    //   borderBottom: 'none',
    //   margin: '0px'
    // }
  },
  scaleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 0px 12px 0px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  scale: {
    width: '24%',
    color: '#777777',
  },
  scaleActive: {
    minWidth: '25%',
    color: '#222222',
    background: 'rgba(24, 160, 251, 0.2)',
    borderRadius: '5px'
  },
  buttonText: {
    fontWeight: '700',
    color: '#ffffff'
  },
  withdrawButtonText: {
    color: '#222222',
    fontWeight: '700'
  },
  headingContainer: {
    width: '100%',
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    }
  },
  heading: {
    paddingBottom: '12px',
    flex: 1,
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    }
  },
  right: {
    textAlign: 'right'
  },
  buttons: {
    display: 'flex',
    width: '100%',
  },
  disabledContainer: {
    width: '100%',
    paddingTop: '12px',
    textAlign: 'center'
  },
  assetSummary: {
    display: 'flex',
    alignItems: 'stretch',
    flex: 1,
    width: '100%',
    marginBottom: '24px',
    flexWrap: 'wrap',
    borderTop: '1px solid #d9d9d9',
    borderBottom: '1px solid #d9d9d9'
  },
  headingEarning: {
    flex: 1,
    padding: '12px',
  },
  headingStrategy: {
    padding: '12px',
    width: '256px'
  },
  grey: {
    color: colors.darkGray
  },
  flexy: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: '0.5rem',
    marginBottom: '1rem'
  },
  fullWidth: {
    minWidth: '100%',
    margin: '18px 0px',
  },
  rail: {
    height: 8
  },
  track: {
    height: 8
  },
  thumb: {
    width: 18,
    height: 18
  },
  slider: {
    width: '80%',
    display: 'flex',
    justifyContent: 'center',
    margin: 'auto',
    marginBottom: 16,
    [theme.breakpoints.down('sm')]: {
      width: '90%'
    }
  },
  projected: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center'
  },
  withdrawalText: {
    marginTop: 20,
    marginBottom: 10
  },
  assetDetails: {
    padding: '1rem'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#222222'
  }
});

const marks = [
  {
    value: 0,
    label: '100'
  },
  {
    value: 50,
    label: '50'
  },
  {
    value: 100,
    label: '100'
  }
];

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

class Asset extends Component {

  constructor() {
    super()

    this.state = {
      amount: '',
      amountError: false,
      redeemEarnAmount: '',
      redeemVaultAmount: '',
      redeemAmount: '',
      redeemAmountError: false,
      account: store.getStore('account'),
      ratio: 50,
      earnRatio: 50,
      vaultRatio: 50,
      percent: 0,
      earnPercent: 0,
      vaultPercent: 0,
      amountPercent: 0,
      hideNav: false,
      openEarnInfo: false,
      openVaultInfo: false
    }
  }

  componentWillMount() {
    emitter.on(DEPOSIT_CONTRACT_RETURNED, this.depositReturned);
    emitter.on(WITHDRAW_VAULT_RETURNED, this.withdrawReturned);
    emitter.on(DEPOSIT_ALL_CONTRACT_RETURNED, this.depositReturned);
    emitter.on(WITHDRAW_BOTH_VAULT_RETURNED, this.withdrawReturned);
    emitter.on(ERROR, this.errorReturned);
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  componentWillUnmount() {
    emitter.removeListener(DEPOSIT_CONTRACT_RETURNED, this.depositReturned);
    emitter.removeListener(WITHDRAW_VAULT_RETURNED, this.withdrawReturned);
    emitter.removeListener(DEPOSIT_ALL_CONTRACT_RETURNED, this.depositReturned);
    emitter.removeListener(WITHDRAW_BOTH_VAULT_RETURNED, this.withdrawReturned);
    emitter.removeListener(ERROR, this.errorReturned);
    window.removeEventListener("resize", this.resize.bind(this));
  };

  resize() {
    let currentHideNav = (window.innerWidth <= 760);
    if (currentHideNav !== this.state.hideNav) {
        this.setState({hideNav: currentHideNav});
    }
  }

  depositReturned = () => {
    this.setState({ loading: false, amount: '' })
  };

  withdrawReturned = (txHash) => {
    this.setState({ loading: false, redeemAmount: '' })
  };

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  render() {
    const { classes, asset } = this.props;
    const {
      amount,
      amountError,
      redeemEarnAmount,
      redeemAmount,
      redeemVaultAmount,
      redeemAmountError,
      loading,
      ratio,
      earnRatio,
      vaultRatio,
      percent,
      earnPercent,
      vaultPercent,
      amountPercent,
      openEarnInfo,
      openVaultInfo
    } = this.state

    return (
      <div className={ classes.vaultContainer }>
        <Grid container className={ classes.assetSummary }>
          <Grid item sm={6} xs={12} style={{borderRight: '1px solid #d9d9d9'}}>
            {this.renderChart(asset)}
          </Grid>
          <Grid item sm={6} xs={12} className={classes.assetDetails}>
            <Typography variant={ 'h4' } className={classes.subtitle} noWrap>STRATEGY</Typography>

            <Grid container style={{marginTop: '1rem'}}>
            <Grid item sm={4} xs={6}>
                <Typography variant={ 'h5' } className={ classes.grey }>Currently Active:</Typography>
                <div className={ classes.flexy }>
                  <Typography variant={ 'h4' } noWrap>{asset.strategy}</Typography>
                </div>  
              </Grid>
              <Grid item sm={4} xs={6}>
                <Typography variant={ 'h5' } className={ classes.grey }>Yearly Growth:</Typography>
                <div className={ classes.flexy }>
                  <Typography variant={ 'h4' } noWrap>{ (this._getAPY(asset)/1).toFixed(2) }% </Typography>
                </div>  
              </Grid>
              <Grid item sm={4} xs={6}>
                <Typography variant={ 'h5' } className={ classes.grey }>Monthly Growth:</Typography>
                <div className={ classes.flexy }>
                  <Typography variant={ 'h4' } noWrap>{ (this._getAPY(asset)/12).toFixed(2) }% </Typography>
                </div>
              </Grid>
              <Grid item sm={4} xs={6}>
                <Typography variant={ 'h5' } className={ classes.grey }>Weekly Growth:</Typography>
                <div className={ classes.flexy }>
                  <Typography variant={ 'h4' } noWrap>{ (this._getAPY(asset)/52).toFixed(2) }% </Typography>
                </div>
              </Grid>
            </Grid>
            <div className={ classes.fullWidth }></div>
            <Typography variant={ 'h4' } className={classes.subtitle} noWrap>STATISTICS</Typography>

            <Grid container style={{marginTop: '1rem'}}>
              <Grid item sm={4} xs={6}>
                <Typography variant={ 'h5' } className={ classes.grey }>Total Earnings:</Typography>
                <div className={ classes.flexy }>
                  <Typography variant={ 'h4' } noWrap>{ asset.addressStatistics ? (asset.addressStatistics.earnings/10**asset.decimals).toFixed(2) : '0.00' } {asset.symbol}</Typography>
                </div>
              </Grid>
              <Grid item sm={4} xs={6}>
                <Typography variant={ 'h5' } className={ classes.grey }>Deposits:</Typography>
                <div className={ classes.flexy }>
                  <Typography variant={ 'h4' } noWrap>{ asset.addressStatistics ? (asset.addressStatistics.totalDeposits/10**asset.decimals).toFixed(2) : '0.00' } {asset.symbol}</Typography>
                </div>
              </Grid>
              <Grid item sm={4} xs={6}>
                <Typography variant={ 'h5' } className={ classes.grey }>Withdrawals:</Typography>
                <div className={ classes.flexy }>
                  <Typography variant={ 'h4' } noWrap>{ asset.addressStatistics ? (asset.addressStatistics.totalWithdrawals/10**asset.decimals).toFixed(2) : '0.00' } {asset.symbol}</Typography>
                </div>
              </Grid>
              <Grid item sm={4} xs={6}>
                <Typography variant={ 'h5' } className={ classes.grey }>Transferred In:</Typography>
                <div className={ classes.flexy }>
                  <Typography variant={ 'h4' } noWrap>{ asset.addressStatistics ? (asset.addressStatistics.totalTransferredIn/10**asset.decimals).toFixed(2) : '0.00' } {asset.symbol}</Typography>
                </div>
              </Grid>
              <Grid item sm={4} xs={6}>
                <Typography variant={ 'h5' } className={ classes.grey }>Transferred Out:</Typography>
                <div className={ classes.flexy }>
                  <Typography variant={ 'h4' } noWrap>{ asset.addressStatistics ? (asset.addressStatistics.totalTransferredOut/10**asset.decimals).toFixed(2) : '0.00' } {asset.symbol}</Typography>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        { 
          (asset.strategyType === 'yearn') && 
            <Grid container className={classes.slider}>
            <Grid item xs={12}>
              <div className={ classes.ratioContainer }>
                <div className={ classes.leftLabelContainer }>
                  <Typography variant='h4' style={{color: '#044b7b'}}>
                    <HtmlTooltip 
                      placement={'top'}
                      title={
                        <React.Fragment>
                          <Typography>See <a href="https://daoventures.gitbook.io/daoventures/" target="_blank">FAQ: Product</a> for more information</Typography>
                        </React.Fragment>
                      } 
                      open={openEarnInfo}
                      onClose={this.handleTooltipEarnClose}
                      PopperProps={{
                        disablePortal: true,
                        style: {
                          pointerEvents: 'auto'
                        }
                      }}
                      disableFocusListener
                      disableHoverListener
                      disableTouchListener>
                      <InfoIcon style={{verticalAlign: 'text-top', cursor: 'pointer'}} onClick={() => this.handleTooltipEarnClose()} /> 
                    </HtmlTooltip>
                    &nbsp;
                    { 'yEarn: '+ earnRatio + '%' }
                  </Typography>
                </div>
                <div>
                  <Typography variant='h4' noWrap>{ 'APY '+ this._getEstimatedAPY(asset) + '%' }</Typography>
                </div>
                <div className={ classes.rightLabelContainer }>
                  <Typography variant='h4' style={{color: '#2962ef'}}>
                    <HtmlTooltip 
                      placement={'top'}
                      title={
                        <React.Fragment>
                          <Typography>See <a href="https://daoventures.gitbook.io/daoventures/" target="_blank">FAQ: Product</a> for more information</Typography>
                        </React.Fragment>
                      } 
                      open={openVaultInfo}
                      onClose={this.handleTooltipVaultClose}
                      PopperProps={{
                        disablePortal: true,
                        style: {
                          pointerEvents: 'auto'
                        }
                      }}
                      disableFocusListener
                      disableHoverListener
                      disableTouchListener>
                        <InfoIcon style={{verticalAlign: 'text-top', cursor: 'pointer'}} onClick={() => this.handleTooltipVaultClose()} /> 
                    </HtmlTooltip>
                    &nbsp;
                    { 'yVault: '+ vaultRatio + '%' }
                  </Typography>
                </div>
              </div>
              <Slider 
                value={ratio}
                step={10}
                classes={{
                  rail: classes.rail,
                  track: classes.track,
                  thumb: classes.thumb
                }}
                onChange={this.handleSliderChange}
                getAriaValueText={this.sliderValueText}
                marks={marks}
                aria-labelledby="continuous-slider" />
            </Grid>
          </Grid>
        }
        <div className={ classes.actionsContainer }>
          <div className={ classes.tradeContainer }>
            <div className={ classes.balances }>
                <Typography variant='h4' onClick={ () => { this.setAmount(100) } } className={ classes.value } noWrap>{ 'Your wallet: '+ (asset.balance ? (Math.floor(asset.balance*10000)/10000).toFixed(4) : '0.0000') } { asset.tokenSymbol ? asset.tokenSymbol : asset.symbol }</Typography>
            </div>
            <TextField
              style={{width: '95%'}}
              className={ classes.actionInput }
              id='amount'
              value={ amount }
              error={ amountError }
              onChange={ this.onChange }
              disabled={ loading }
              placeholder="0.00"
              variant="outlined"
              onKeyDown={ this.inputKeyDown }
            />
            <div className={ classes.scaleContainer }>
              <Button
                className={ percent === 25 ? classes.scaleActive : classes.scale }
                variant='text'
                disabled={ loading }
                onClick={ () => { this.setAmount(25) } }>
                <Typography variant={'h5'}>25%</Typography>
              </Button>
              <Button
                className={ percent === 50 ? classes.scaleActive : classes.scale }
                variant='text'
                disabled={ loading }
                onClick={ () => { this.setAmount(50) } }>
                <Typography variant={'h5'}>50%</Typography>
              </Button>
              <Button
                className={ percent === 75 ? classes.scaleActive : classes.scale }
                variant='text'
                disabled={ loading }
                onClick={ () => { this.setAmount(75) } }>
                <Typography variant={'h5'}>75%</Typography>
              </Button>
              <Button
                className={ percent === 100 ? classes.scaleActive : classes.scale }
                variant='text'
                disabled={ loading }
                onClick={ () => { this.setAmount(100) } }>
                <Typography variant={'h5'}>100%</Typography>
              </Button>
            </div>
            <div className={ classes.buttons }>
              { asset.deposit === true &&
                <Button
                  className={ classes.actionButton }
                  disabled={ loading || asset.balance <= 0 || asset.depositDisabled === true }
                  onClick={ this.onDeposit }
                  >
                  <Typography className={ classes.buttonText } variant={ 'h5'} color={asset.disabled?'':'secondary'}>Deposit</Typography>
                </Button>
              }
              { asset.depositAll === true &&
                <Button
                  className={ classes.actionButton }
                  disabled={ loading || asset.balance <= 0 || asset.depositDisabled === true }
                  onClick={ this.onDepositAll }
                  >
                  <Typography className={ classes.buttonText } variant={ 'h5'} color={asset.disabled?'':'secondary'}>Deposit All</Typography>
                </Button>
              }
            </div>
            { asset.depositDisabled === true &&
              <div className={classes.disabledContainer}>
                <Typography variant='h4'>Deposits are currently disabled for this vault</Typography>
              </div>
            }
          </div>
          <div className={ classes.sepperator }></div>
          <div className={classes.tradeContainer}>
            {
              (asset.strategyType === 'yearn') && 
                <div className={ classes.withdrawContainer }>
                  <div className={ classes.tradeContainer }>
                    <Typography variant='h5' style={{color: '#044b7b'}} className={ classes.withdrawalText }>Earn</Typography>
                    <Typography variant='h4' onClick={ () => { this.setRedeemEarnAmount(100) } }  className={ classes.value } noWrap>{ (asset.earnBalance ? (Math.floor(asset.earnBalance*asset.earnPricePerFullShare*10000)/10000).toFixed(4) : '0.0000') } { asset.symbol } ({ asset.earnBalance ? (Math.floor(asset.earnBalance*10000)/10000).toFixed(4) : '0.0000' } { asset.vaultSymbol }) </Typography>
                    <TextField
                      style={{width: '95%'}}
                      className={ classes.actionInput }
                      id='redeemEarnAmount'
                      value={ redeemEarnAmount }
                      error={ redeemAmountError }
                      onChange={ this.onChange }
                      disabled={ loading }
                      placeholder="0.00"
                      variant="outlined"
                      onKeyDown={ this.inputRedeemKeyDown }
                    />
                    <div className={ classes.scaleContainer }>
                      <Button
                        className={ earnPercent === 25 ? classes.scaleActive : classes.scale }
                        variant='text'
                        disabled={ loading }
                        color="primary"
                        onClick={ () => { this.setRedeemEarnAmount(25) } }>
                        <Typography variant={'h5'}>25%</Typography>
                      </Button>
                      <Button
                        className={ earnPercent === 50 ? classes.scaleActive : classes.scale }
                        variant='text'
                        disabled={ loading }
                        color="primary"
                        onClick={ () => { this.setRedeemEarnAmount(50) } }>
                        <Typography variant={'h5'}>50%</Typography>
                      </Button>
                      <Button
                        className={ earnPercent === 75 ? classes.scaleActive : classes.scale }
                        variant='text'
                        disabled={ loading }
                        color="primary"
                        onClick={ () => { this.setRedeemEarnAmount(75) } }>
                        <Typography variant={'h5'}>75%</Typography>
                      </Button>
                      <Button
                        className={ earnPercent === 100 ? classes.scaleActive : classes.scale }
                        variant='text'
                        disabled={ loading }
                        color="primary"
                        onClick={ () => { this.setRedeemEarnAmount(100) } }>
                        <Typography variant={'h5'}>100%</Typography>
                      </Button>
                    </div>
                  </div>
                  <div className={ classes.tradeContainer }>
                    <Typography variant='h5' style={{color: '#2962ef'}} className={ classes.withdrawalText }>Vault</Typography>
                    <Typography variant='h4' onClick={ () => { this.setRedeemVaultAmount(100) } }  className={ classes.value } noWrap>{ (asset.vaultBalance ? (Math.floor(asset.vaultBalance*asset.vaultPricePerFullShare*10000)/10000).toFixed(4) : '0.0000') } { asset.symbol } ({ asset.vaultBalance ? (Math.floor(asset.vaultBalance*10000)/10000).toFixed(4) : '0.0000' } { asset.vaultSymbol }) </Typography>
                    <TextField
                      fullWidth
                      className={ classes.actionInput }
                      id='redeemVaultAmount'
                      value={ redeemVaultAmount }
                      error={ redeemAmountError }
                      onChange={ this.onChange }
                      disabled={ loading }
                      placeholder="0.00"
                      variant="outlined"
                      onKeyDown={ this.inputRedeemKeyDown }
                      />
                    <div className={ classes.scaleContainer }>
                      <Button
                        className={ vaultPercent === 25 ? classes.scaleActive : classes.scale }
                        variant='text'
                        disabled={ loading }
                        color="primary"
                        onClick={ () => { this.setRedeemVaultAmount(25) } }>
                        <Typography variant={'h5'}>25%</Typography>
                      </Button>
                      <Button
                        className={ vaultPercent === 50 ? classes.scaleActive : classes.scale }
                        variant='text'
                        disabled={ loading }
                        color="primary"
                        onClick={ () => { this.setRedeemVaultAmount(50) } }>
                        <Typography variant={'h5'}>50%</Typography>
                      </Button>
                      <Button
                        className={ vaultPercent === 75 ? classes.scaleActive : classes.scale }
                        variant='text'
                        disabled={ loading }
                        color="primary"
                        onClick={ () => { this.setRedeemVaultAmount(75) } }>
                        <Typography variant={'h5'}>75%</Typography>
                      </Button>
                      <Button
                        className={ vaultPercent === 100 ? classes.scaleActive : classes.scale }
                        variant='text'
                        disabled={ loading }
                        color="primary"
                        onClick={ () => { this.setRedeemVaultAmount(100) } }>
                        <Typography variant={'h5'}>100%</Typography>
                      </Button>
                    </div>
                  </div>
                </div>
            }
            {
              (asset.strategyType === 'compound') &&
              <div className={ classes.withdrawContainer }>
                <div className={ classes.tradeContainer }>
                  <Typography variant='h4' onClick={ () => { this.setRedeemAmount(100) } }  className={ classes.value } noWrap>{ (asset.strategyBalance ? (Math.floor(asset.strategyBalance*asset.compoundExchangeRate*10000)/10000).toFixed(4) : '0.0000') } { asset.symbol } ({ asset.strategyBalance ? (Math.floor(asset.strategyBalance*10000)/10000).toFixed(4) : '0.0000' } { asset.vaultSymbol }) </Typography>
                  <TextField
                    style={{width: '95%'}}
                    className={ classes.actionInput }
                    id='redeemAmount'
                    value={ redeemAmount }
                    error={ redeemAmountError }
                    onChange={ this.onChange }
                    disabled={ loading }
                    placeholder="0.00"
                    variant="outlined"
                    onKeyDown={ this.inputRedeemKeyDown }
                  />
                  <div className={ classes.scaleContainer }>
                    <Button
                      className={ amountPercent === 25 ? classes.scaleActive : classes.scale }
                      variant='text'
                      disabled={ loading }
                      color="primary"
                      onClick={ () => { this.setRedeemAmount(25) } }>
                      <Typography variant={'h5'}>25%</Typography>
                    </Button>
                    <Button
                      className={ amountPercent === 50 ? classes.scaleActive : classes.scale }
                      variant='text'
                      disabled={ loading }
                      color="primary"
                      onClick={ () => { this.setRedeemAmount(50) } }>
                      <Typography variant={'h5'}>50%</Typography>
                    </Button>
                    <Button
                      className={ amountPercent === 75 ? classes.scaleActive : classes.scale }
                      variant='text'
                      disabled={ loading }
                      color="primary"
                      onClick={ () => { this.setRedeemAmount(75) } }>
                      <Typography variant={'h5'}>75%</Typography>
                    </Button>
                    <Button
                      className={ amountPercent === 100 ? classes.scaleActive : classes.scale }
                      variant='text'
                      disabled={ loading }
                      color="primary"
                      onClick={ () => { this.setRedeemAmount(100) } }>
                      <Typography variant={'h5'}>100%</Typography>
                    </Button>
                  </div>
                </div>
              </div>
            }
            
            <div className={ classes.buttons }>
              { asset.withdraw === true &&
                <Button
                  className={ classes.withdrawButton }
                  disabled={ loading || (asset.vaultBalance <= 0 && asset.earnBalance <= 0 ** asset.strategyBalance <= 0) }
                  onClick={ this.onWithdraw }
                  fullWidth
                  >
                  <Typography className={ classes.withdrawButtonText } variant={ 'h5'}>Withdraw</Typography>
                </Button>
              }
              { asset.withdrawAll === true &&
                <Button
                  className={ classes.withdrawButton }
                  disabled={ loading || (asset.vaultBalance <= 0 && asset.earnBalance <= 0 ** asset.strategyBalance <= 0) }
                  onClick={ this.onWithdrawAll }
                  fullWidth
                  >
                  <Typography className={ classes.withdrawButtonText } variant={ 'h5'}>Withdraw All</Typography>
                </Button>
              }
            </div>
          </div>
        </div>
      </div>
    )
  };

  renderChart = (asset) => {
    var earnAPY = [];
    var vaultAPY = [];
    var compoundAPY = [];
    var labels = [];

    const { hideNav } = this.state;

    const sortByTimestamp = (a, b) => {
      if (a.timestamp > b.timestamp) return 1;
      if (a.timestamp < b.timestamp) return -1;
      return 0;
    }

    if (asset.historicalAPY) {
      // this gives an object with dates as keys
      const groups = asset.historicalAPY
      .sort(sortByTimestamp)
      .reduce((groups, apy) => {
        const date = moment.unix(apy.timestamp/1000).format('DD-MM-YYYY');
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(apy);
        return groups;
      }, {});
      
      try {
        Object.keys(groups)
        .forEach((date) => {
          // first attempt
          labels.push(date);

          if (asset.strategyType === 'yearn') {
            earnAPY.push([date, parseFloat((parseFloat(groups[date][0].aprs) * 100).toFixed(4))]);
            vaultAPY.push([date, parseFloat(groups[date][0].apyInceptionSample.toFixed(4))]);
          } else if (asset.strategyType === 'compound') {
            compoundAPY.push([date, parseFloat(groups[date][0].compoundApy.toFixed(4))])
          }
          
          // second attempt
          var halfCount = Math.round(Number(groups[date].length / 2))
          if (halfCount !== 1) {
            labels.push(date);

            if (asset.strategyType === 'yearn') {
              earnAPY.push([date, parseFloat((parseFloat(groups[date][halfCount].aprs) * 100).toFixed(4))]);
              vaultAPY.push([date, parseFloat(groups[date][halfCount].apyInceptionSample.toFixed(4))]);
            } else if (asset.strategyType === 'compound') {
              compoundAPY.push([date, parseFloat(groups[date][halfCount].compoundAPY.toFixed(4))]);
            }
          }        
        })
      } catch (ex) {}
    }

    let options = {};
    if (asset.strategyType === 'yearn') {
      options = {
        chart: {
          width: hideNav ? 300 : 420
        },
        title: {
          text: 'Historical Earn & Vault Performance'
        },
        xAxis: {
          categories: labels
        },
        series: [
          {
            name: 'Earn',
            data: earnAPY
          },
          {
            name: 'Vault',
            data: vaultAPY
          }
        ],
        responsive: {
          rules: [{
            condition: {
              maxWidth: 450,
              chartOptions: {
                chart: {
                  width: 300
                }
              }
            }
          }]
        },
        credits: {
          enabled: false
        }
      };
    } else if (asset.strategyType === 'compound') {
      options = {
        chart: {
          width: hideNav ? 300 : 420
        },
        title: {
          text: 'Historical Earn & Vault Performance'
        },
        xAxis: {
          categories: labels
        },
        series: [
          {
            name: 'Compound',
            data: compoundAPY
          },
        ],
        responsive: {
          rules: [{
            condition: {
              maxWidth: 450,
              chartOptions: {
                chart: {
                  width: 300
                }
              }
            }
          }]
        },
        credits: {
          enabled: false
        }
      };
    }

    return (
      <div>
        <HighchartsReact highcharts={Highcharts} options={options} style={{ margin: 'auto' }} />
      </div>
    );
  }

  _getAPY = (asset) => {
    const { basedOn } = this.props
    // To calculate APY (Vault + Earn divide by 2 : Estimated)
    // Compound APY is using compoundApy
    if(asset && asset.stats) {
      if (asset.strategyType === 'compound') {
        if (asset.stats.compoundApy) {
          return asset.stats.compoundApy;
        } else {
          return '0.00'
        }
      } else if (asset.strategyType === 'yearn') {
        switch (basedOn) {
          case 1:
            return (asset.stats.apyOneWeekSample + parseFloat(asset.earnApr) * 100) / 2
          case 2:
            return (asset.stats.apyOneMonthSample + parseFloat(asset.earnApr) * 100) / 2
          case 3:
            return (asset.stats.apyInceptionSample + parseFloat(asset.earnApr) * 100) / 2
          default:
            return (asset.apy + parseFloat(asset.earnApr) * 100) / 2
        }
      }
    } else {
      return '0.00'
    }
  }

  _getEstimatedAPY = (asset) => {
    const {
      earnRatio,
      vaultRatio
    } = this.state;

    const earnAPY = asset.earnApr ? parseFloat(asset.earnApr) * 100 : 0;
    const vaultAPY = asset && asset.stats ? asset.stats.apyOneWeekSample : 0
    return ((earnAPY * earnRatio / 100) + (vaultAPY * vaultRatio / 100) / 2).toFixed(2)
  }

  handleSliderChange = (event, newValue) => {
    this.setState({ 
      ratio: newValue,
      earnRatio: 100 - newValue,
      vaultRatio: newValue
    })
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

  sliderValueText = (value) => {
    return value;
  }

  onDeposit = () => {
    this.setState({ amountError: false })

    const { amount, earnRatio, vaultRatio } = this.state
    const { asset, startLoading } = this.props

    if(!amount || isNaN(amount) || amount <= 0 || amount > asset.balance) {
      this.setState({ amountError: true })
      return false
    }

    this.setState({ loading: true })
    startLoading()

    if (asset.strategyType === 'yearn') {
      dispatcher.dispatch({ type: DEPOSIT_CONTRACT, content: { 
        earnAmount: (amount * earnRatio / 100).toString(), 
        vaultAmount: (amount * vaultRatio/ 100).toString(), 
        amount: '0',
        asset 
      } })
    } else if (asset.strategyType === 'compound') {
      dispatcher.dispatch({ type: DEPOSIT_CONTRACT, content: { 
        earnAmount: 0, 
        vaultAmount: 0, 
        amount: amount.toString(),
        asset 
      } })
    }
  }

  onDepositAll = () => {
    const { asset, startLoading } = this.props
    const { earnRatio, vaultRatio } = this.state

    this.setState({ loading: true })
    startLoading()

    if (asset.strategyType === 'yearn') {
      dispatcher.dispatch({ type: DEPOSIT_ALL_CONTRACT, content: { 
        asset,
        earnAmount: (asset.balance * earnRatio / 100).toString(), 
        vaultAmount: (asset.balance * vaultRatio/ 100).toString(), 
      } })
    } else if (asset.strategyType === 'compound') {
      dispatcher.dispatch({ type: DEPOSIT_ALL_CONTRACT, content: { 
        earnAmount: 0, 
        vaultAmount: 0, 
        asset 
      } })
    }
  }

  onWithdraw = () => {
    this.setState({ redeemAmountError: false })

    const { asset, startLoading  } = this.props

    if (asset.strategyType === 'yearn') {
      let redeemVaultAmount = this.state.redeemVaultAmount.toString()
      redeemVaultAmount = (Math.floor(redeemVaultAmount*10000)/10000).toFixed(4);
      if(!redeemVaultAmount || isNaN(redeemVaultAmount) || redeemVaultAmount < 0) {
        this.setState({ redeemAmountError: true })
        return false
      }

      let redeemEarnAmount = this.state.redeemEarnAmount.toString()
      redeemEarnAmount = (Math.floor(redeemEarnAmount*10000)/10000).toFixed(4);
      if(!redeemEarnAmount || isNaN(redeemEarnAmount) || redeemEarnAmount < 0) {
        this.setState({ redeemAmountError: true })
        return false
      }

      this.setState({ loading: true })
      startLoading()
      
      dispatcher.dispatch({ type: WITHDRAW_BOTH, content: { earnAmount: redeemEarnAmount, vaultAmount: redeemVaultAmount, amount: '0', asset: asset } })
    } else if (asset.strategyType === 'compound') {
      let redeemAmount = this.state.redeemAmount.toString()
      redeemAmount = (Math.floor(redeemAmount*10000)/10000).toFixed(4);
      if(!redeemAmount || isNaN(redeemAmount) || redeemAmount < 0) {
        this.setState({ redeemAmountError: true })
        return false
      }

      this.setState({ loading: true })
      startLoading()
      
      dispatcher.dispatch({ type: WITHDRAW_BOTH, content: { earnAmount: '0', vaultAmount: '0', amount: redeemAmount, asset: asset } })
    }
  }

  onWithdrawAll = () => {
    const { asset, startLoading } = this.props

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: WITHDRAW_BOTH_VAULT, content: { asset: asset } })
  }

  setAmount = (percent) => {
    if(this.state.loading) {
      return
    }

    const { asset } = this.props

    const balance = asset.balance
    let amount = balance*percent/100
    amount = Math.floor(amount*10000)/10000;

    this.setState({ amount: amount.toFixed(4), percent })
  }

  setRedeemAmount = (percent) => {
    if(this.state.loading) {
      return
    }

    const balance = this.props.asset.strategyBalance
    let amount = balance*percent/100
    amount = Math.floor(amount*10000)/10000;

    this.setState({ redeemAmount: amount.toFixed(4) })
  }

  setRedeemVaultAmount = (percent) => {
    if(this.state.loading) {
      return
    }

    const balance = this.props.asset.vaultBalance
    let amount = balance*percent/100
    amount = Math.floor(amount*10000)/10000;

    this.setState({ redeemVaultAmount: amount.toFixed(4), vaultPercent: percent })
  }

  setRedeemEarnAmount = (percent) => {
    if(this.state.loading) {
      return
    }

    const balance = this.props.asset.earnBalance
    let amount = balance*percent/100
    amount = Math.floor(amount*10000)/10000;

    this.setState({ redeemEarnAmount: amount.toFixed(4), earnPercent: percent })
  }

  handleTooltipEarnClose = () => {
    this.setState({
      openEarnInfo: !this.state.openEarnInfo
    })
  }

  handleTooltipVaultClose = () => {
    this.setState({
      openVaultInfo: !this.state.openVaultInfo
    })
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(Asset));
