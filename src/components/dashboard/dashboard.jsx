import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  MenuItem,
  Grid
} from '@material-ui/core';
import { colors, drawerWidth } from '../../theme'

import Loader from '../loader'
import InfoIcon from '@material-ui/icons/Info';

import {
  ERROR,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  GET_DASHBOARD_SNAPSHOT,
  DASHBOARD_SNAPSHOT_RETURNED,
} from '../../constants'

import Store from "../../stores";
import UnlockModal from "../unlock/unlockModal";
import Highcharts from 'highcharts';
import HighchartsReact from "highcharts-react-official";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  contentContainer: {
    minWidth: '100%',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    [theme.breakpoints.up('md')]: {
      minWidth: 'calc(100% - '+ drawerWidth + 'px)',
    }
  },
  investedContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: '100%',
    [theme.breakpoints.up('md')]: {
      minWidth: '900px',
      padding: '3rem'
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: '90%',
      margin: 'auto',
      marginTop: '40px',
      width: '95vw'
    }
  },
  disaclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    marginBottom: '24px',
    background: colors.white
  },
  portfolioContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  vaultContainer: {
    padding: '28px 30px',
    borderRadius: '10px',
    border: '1px solid #d9d9d9',
    background: colors.white,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: '2rem',
    [theme.breakpoints.down('sm')]: {
      padding: '10px'
    }
  },
  earnContainer: {
    marginTop: '40px',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    background: colors.white,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  gray: {
    color: colors.darkGray
  },
  between: {
    width: '40px',
    height: '40px'
  },
  titleBalance: {
    padding: '28px 30px !important',
    borderRadius: '10px',
    border: '1px solid #d9d9d9',
    background: colors.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    cursor: 'pointer',
    maxWidth: '49%',
    [theme.breakpoints.down('sm')]: {
      padding: '17px 20px !important',
    }
  },
  prettyAlign: {
    display: 'flex',
    alignItems: 'center'
  },
  infoIcon: {
    fontSize: '1em',
    marginRight: '6px'
  },
  assetSummary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    flexWrap: 'wrap',
    [theme.breakpoints.up('sm')]: {
      flexWrap: 'nowrap'
    }
  },
  assetIcon: {
    display: 'flex',
    alignItems: 'center',
    verticalAlign: 'middle',
    borderRadius: '20px',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    cursor: 'pointer',
    marginRight: '12px',
  },
  heading: {
    display: 'block',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: '200px',
      alignItems: 'flex-end'
    }
  },
  headingName: {
    display: 'flex',
    alignItems: 'center',
    width: '325px',
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
      flex: 1
    }
  },
  flexy: {
    display: 'flex',
    alignItems: 'center'
  },
  vault: {
    borderBottom: '1px solid rgba(25, 101, 233, 0.2)',
    padding: '12px 0px',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  sectionHeading: {
    color: '#222222',
    fontSize: '1.2rem'
  },
  inline: {
    display: 'flex',
    alignItems: 'baseline'
  },
  symbol: {
    paddingLeft: '6px'
  },
  symbolAt: {
    paddingLeft: '6px',
    color: colors.darkGray
  },
  basedOnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  welcomeText: {
    fontWeight: 'bold',
    fontSize: '2rem',
    lineHeight: '38px',
    color: '#444444',
    textAlign: 'center'
  },
  warningMessage: {
    fontSize: '1rem',
    lineHeight: '19px',
    textAlign: 'center',
    color: '#18A0FB',
    position: 'absolute',
    bottom: '5%',
    left: '0',
    right: '0',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    }
  },
  buttonGroup: {
    background: '#18A0FB',
    borderRadius: '48px',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    width: '80%',
    margin: 'auto',
    cursor: 'pointer',
  },
  buttonIconContainer: {
    width: '60px',
    background: '#50B9FF',
    borderRadius: '48px 0px 0px 48px',
    textAlign: 'center',
    padding: '0.5rem 1.5rem',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  connectButtonIcon: {
    width: '60%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    }
  },
  buttonTextContainer: {
    padding: '1rem 2rem',
    textAlign: 'center'
  },
  buttonContainer: {
    textAlign: 'center',
    marginTop: '5rem',
    [theme.breakpoints.down('sm')]: {
      marginTop: '3rem'
    }
  },
  descriptionContainer: {
    border: '1px solid #DDDDDD',
    marginTop: '8rem',
    borderRadius: '10px',
    padding: '1.5rem 3.5rem',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '90%',
      margin: 'auto',
      marginTop: '4rem',
    }
  },
  shieldContainer: {
    background: 'rgba(24,160,251, 0.1)',
    borderRadius: '10px',
    width: '36px',
    margin: 'auto',
    padding: '0.6rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#4444444',
    lineHeight: '22px',
    marginTop: '1rem'
  },
  securityDesc: {
    color: '#777777',
    fontSize: '.9rem',
    lineHeight: '18px',
    marginTop: '0.8rem'
  },
  chartContainer: {
    border: '1px solid #D9D9D9',
    borderRadius: '10px',
    padding: '10px',
    background: '#ffffff',
    marginBottom: '2rem',
    width: '100%'
  },
  amountValue: {
    color: '#222222',
    fontSize: '30px',
    marginTop: '5px',
    wordBreak: 'break-all',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px'
    }
  },
  inlineBlock: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      display: 'block'
    }
  },
  netWorth: {
    color: '#8888888',
    fontSize: '0.8rem',
    textAlign: 'right',
    fontWeight: 'bold'
  },
  assetName: {
    color: '#222222',
    fontSize: '1.1rem'
  },
  dataValue: {
    fontSize: '1rem',
    color: '#158920',
    background: '#DAF3E4',
    borderRadius: '5px',
    padding: '10px'
  },
  labelSize: {
    fontSize: '13px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px'
    }
  }
});

class Dashboard extends Component {

  constructor(props) {
    super()

    const dashboard = store.getStore('dashboard')
    const account = store.getStore('account')
    const growth = localStorage.getItem('yearn.finance-dashboard-growth')
    const currency = localStorage.getItem('yearn.finance-dashboard-currency')
    const basedOn = localStorage.getItem('yearn.finance-dashboard-basedon')

    this.state = {
      dashboard: dashboard,
      account: account,
      loading: true,
      growth: growth ? parseInt(growth) : 0, // 0=daily 1=weekly 2=yearly
      currency: currency ? currency : 'USD', // USD / ETH,
      basedOn: basedOn ? parseInt(basedOn > 3 ? 3 : basedOn) : 1, // 1=apyThreeDaySample  2=apyOneWeekSample  3= apyInceptionSample  4=apyInceptionSample (old)
      modalOpen: false
    }

    if(account && account.address) {
      dispatcher.dispatch({ type: GET_DASHBOARD_SNAPSHOT, content: {} })
    }
  }

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(DASHBOARD_SNAPSHOT_RETURNED, this.dashboardSnapshotReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(DASHBOARD_SNAPSHOT_RETURNED, this.dashboardSnapshotReturned);
  };

  dashboardSnapshotReturned = () => {
    this.setState({
      loading: false,
      dashboard: store.getStore('dashboard')
    })
  }

  connectionConnected = () => {
    const account = store.getStore('account')
    this.setState({ loading: true, account: account })
    dispatcher.dispatch({ type: GET_DASHBOARD_SNAPSHOT, content: {} })
  };

  connectionDisconnected = () => {
    this.setState({ account: null })
  };

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  render() {
    const { classes } = this.props;
    const {
      loading,
      dashboard,
      growth,
      currency,
      account,
      modalOpen,
    } = this.state

    if(!account || !account.address) {
      return (
        <div className={ classes.root }>
          <div className={classes.contentContainer}>
            <div>
              <Typography variant={'h2'} className={classes.welcomeText}>Welcome to DAOventures</Typography>
              <Typography className={classes.titleDesc} variant={'body1'}>Connect an Ethereum wallet to manage and invest your DeFi portfolio</Typography>
              <div className={classes.buttonContainer}>
                <Grid container className={classes.buttonGroup} onClick={this.addressClicked}>
                  <Grid item sm={3} xs={3} className={classes.buttonIconContainer}>
                    <img 
                        alt=""
                        src={require('../../assets/metamask.svg')}
                        className={classes.connectButtonIcon}
                      />
                  </Grid>
                  <Grid item sm={9} xs={9} className={classes.buttonTextContainer}>
                    <Typography variant='h4'>Connect to Metamask wallet</Typography>
                  </Grid>
                </Grid>
              </div>
              <div className={classes.descriptionContainer}>
                <div className={classes.shieldContainer}>
                  <img 
                    alt=""
                    src={require('../../assets/shield.svg')}
                  />
                </div>
                <Typography variant='h3' className={classes.subtitle}>Non-custodial & Secure</Typography>
                <Typography variant='body2' className={classes.securityDesc}>We do not own your private keys and cannot access your funds.</Typography>
              </div>
            </div>
            <Typography variant='body1' className={classes.warningMessage}>*Crypto is volatile, DeFi is new and risky. Please use it at your own risk.</Typography>
          </div>
          { modalOpen && this.renderModal() }
        </div>
      )
    }

    return (
      <div className={ classes.root }>
        <div className={classes.contentContainer}>
          <div className={ classes.investedContainer}>
            {this.renderChart()}
            <Grid container spacing={1} className={ classes.portfolioContainer }>
              <Grid item sm={6} xs={6} className={ classes.titleBalance }>
                <Typography variant={ 'h4' } className={[classes.gray, classes.labelSize ]}>Portfolio Balance</Typography>
                <Typography variant={ 'h2' } className={classes.amountValue}>$ { parseFloat(dashboard.portfolio_balance_usd.toFixed(2)).toLocaleString() }</Typography>
              </Grid>
              { growth === 0 &&
                <Grid item sm={6} xs={6} className={ classes.titleBalance } onClick={ this.growthClicked }>
                  <Typography variant={ 'h4' } className={ `${classes.gray} ${classes.prettyAlign} ${classes.labelSize}` }>
                    Daily Growth
                  </Typography>
                  <Typography variant={ 'h2' } className={classes.amountValue}>$ { parseFloat(dashboard.portfolio_growth_usd_daily.toFixed(2)).toLocaleString() }</Typography>
                </Grid>
              }

              { growth === 1 &&
                <Grid item sm={6} xs={6} className={ classes.titleBalance } onClick={ this.growthClicked }>
                  <Typography variant={ 'h4' } className={ `${classes.gray} ${classes.prettyAlign} ${classes.labelSize}` }>
                    Weekly Growth
                  </Typography>
                  <Typography variant={ 'h2' } className={classes.amountValue}>$ { parseFloat(dashboard.portfolio_growth_usd_weekly.toFixed(2)).toLocaleString() }</Typography>
                </Grid>
              }

              { growth === 2 &&
                <Grid item sm={6} xs={6} className={ classes.titleBalance } onClick={ this.growthClicked }>
                  <Typography variant={ 'h4' } className={ `${classes.gray} ${classes.prettyAlign} ${classes.labelSize}` }>
                    Yearly Growth
                  </Typography>
                  <Typography variant={ 'h2' } className={classes.amountValue}>$ { parseFloat(dashboard.portfolio_growth_usd_yearly.toFixed(2)).toLocaleString() }</Typography>
                </Grid>
              }
            </Grid>
            { (true) &&
              <div className={ classes.vaultContainer }>
                <div className={classes.inlineBlock}>
                  <div>
                    <Typography variant={ 'h3' } className={ classes.sectionHeading }>Yearn Farmer Overview</Typography>
                  </div>
                  { this.renderBasedOn() }
                </div>
                <Typography variant={ 'caption' } className={ classes.netWorth }>NET WORTH</Typography>

                { this.renderVaults() }
              </div>
            }
            {/* { (dashboard.vaults && dashboard.vaults.length > 0) &&
              <div className={ classes.vaultContainer }>
                <Typography variant={ 'h3' } className={ classes.sectionHeading }>Vaults Overview</Typography>
                { this.renderVaults() }
              </div>
            }
            { (dashboard.assets && dashboard.assets.length > 0) &&
              <div className={ classes.earnContainer }>
                <Typography variant={ 'h3' } className={ classes.sectionHeading }>Earn Overview</Typography>
                { this.renderEarn() }
              </div>
            } */}
          </div>
        </div>
        { loading && <Loader /> }
      </div>
    )
  };

  renderBasedOn = () => {

    const { classes } = this.props
    const { basedOn, loading } = this.state

    const options = [
      {
        value: 1,
        description: '1 week'
      },
      {
        value: 2,
        description: '1 month'
      },
      {
        value: 3,
        description: 'inception'
      }
    ]

    return (
      <div className={ classes.basedOnContainer }>
        <Typography style={{fontSize: '0.8rem', color: '#777777'}}>Growth is based on the vault's performance { basedOn === 3 ? 'since' : 'for the past' }</Typography>
        <TextField
          id={ 'basedOn' }
          name={ 'basedOn' }
          select
          value={ basedOn }
          onChange={ this.onSelectChange }
          SelectProps={{
            native: false
          }}
          disabled={ loading }
          className={ classes.assetSelectRoot }
        >
        { options &&
          options.map((option) => {
            return (
              <MenuItem key={ option.value } value={ option.value }>
                <Typography variant='body1' style={{fontSize: '0.8rem', fontWeight: 'bold', color: '#222'}}>{ option.description }</Typography>
              </MenuItem>
            )
          })
        }
      </TextField>
      </div>
    )
  }

  onSelectChange = (event) => {
    let val = []
    val[event.target.name] = event.target.value
    this.setState(val)

    localStorage.setItem('yearn.finance-dashboard-basedon', event.target.value)

    this.setState({ loading: true })
    dispatcher.dispatch({ type: GET_DASHBOARD_SNAPSHOT, content: {} })
  }

  growthClicked = () => {
    const { growth } = this.state
    let newGrowth = 0
    switch (growth) {
      case 0:
        newGrowth = 1
        break;
      case 1:
        newGrowth = 2
        break;
      case 2:
        newGrowth = 0
        break;
      default:
        newGrowth = 0
    }
    this.setState({ growth: newGrowth })
    localStorage.setItem('yearn.finance-dashboard-growth', newGrowth.toString())
  }

  renderVaults = () => {
    const { growth, currency } = this.state
    const { vaults } = this.state.dashboard
    const { classes } = this.props

    if(!vaults || vaults.length === 0) {
      return null
    }

    return vaults.map((asset) => {
      return (<div className={ classes.vault } key={asset.id}>
        <div className={ classes.assetSummary }>
          <div className={classes.headingName}>
            <div className={ classes.assetIcon }>
              <img
                alt=""
                src={ require('../../assets/'+asset.symbol+'-logo.png') }
                height={ '30px'}
              />
            </div>
            <div>
              <Typography variant={ 'h5' } noWrap className={classes.assetName}>{ asset.name }</Typography>
              <Typography variant={ 'h5' } noWrap className={ classes.gray }>{ asset.description }</Typography>
            </div>
          </div>
          {/* { growth === 0 &&
            <div className={classes.heading}>
              { currency === 'USD' &&
                <div className={ classes.inline }>
                  <Typography variant={ 'h3' } noWrap>$ { parseFloat(asset.vaultGrowth_daily_usd.toFixed(2)).toLocaleString() }</Typography >
                  <Typography className={ classes.symbolAt } variant={ 'h4' }> @ </Typography>
                  <Typography className={ classes.symbol } variant={ 'h4' }> { (this._getAPY(asset)/365).toFixed(2) }%</Typography>
                </div>
              }
              { currency === 'ETH' &&
                <div className={ classes.inline }>
                  <Typography variant={ 'h3' } noWrap>{ parseFloat(asset.vaultGrowth_daily_eth.toFixed(2)).toLocaleString() }</Typography >
                  <Typography className={ classes.symbol } variant={ 'h4' }>ETH</Typography>
                  <Typography className={ classes.symbolAt } variant={ 'h4' }> @ </Typography>
                  <Typography className={ classes.symbol } variant={ 'h4' }> { (this._getAPY(asset)/365).toFixed(2) }%</Typography>
                </div>
              }
            </div>
          }
          { growth === 1 &&
            <div className={classes.heading}>
              { currency === 'USD' &&
                <div className={ classes.inline }>
                  <Typography variant={ 'h3' } noWrap>$ { parseFloat(asset.vaultGrowth_weekly_usd.toFixed(2)).toLocaleString() }</Typography >
                  <Typography className={ classes.symbolAt } variant={ 'h4' }> @ </Typography>
                  <Typography className={ classes.symbol } variant={ 'h4' }> { (this._getAPY(asset)/52).toFixed(2) }%</Typography>
                </div>
              }
              { currency === 'ETH' &&
                <div className={ classes.inline }>
                  <Typography variant={ 'h3' } noWrap>{ parseFloat(asset.vaultGrowth_weekly_eth.toFixed(2)).toLocaleString() }</Typography >
                  <Typography className={ classes.symbol } variant={ 'h4' }>ETH</Typography>
                  <Typography className={ classes.symbolAt } variant={ 'h4' }> @ </Typography>
                  <Typography className={ classes.symbol } variant={ 'h4' }> { (this._getAPY(asset)/52).toFixed(2) }%</Typography>
                </div>
              }
            </div>
          }
          { growth === 2 &&
            <div className={classes.heading}>
              { currency === 'USD' &&
                <div className={ classes.inline }>
                  <Typography variant={ 'h3' } noWrap>$ { parseFloat(asset.vaultGrowth_yearly_usd.toFixed(2)).toLocaleString() }</Typography >
                  <Typography className={ classes.symbolAt } variant={ 'h4' }> @ </Typography>
                  <Typography className={ classes.symbol } variant={ 'h4' }> { (this._getAPY(asset)/1).toFixed(2) }%</Typography>
                </div>
              }
              { currency === 'ETH' &&
                <div className={ classes.inline }>
                  <Typography variant={ 'h3' } noWrap>{ parseFloat(asset.vaultGrowth_yearly_eth.toFixed(2)).toLocaleString() }</Typography >
                  <Typography className={ classes.symbol } variant={ 'h4' }>ETH</Typography>
                  <Typography className={ classes.symbolAt } variant={ 'h4' }> @ </Typography>
                  <Typography className={ classes.symbol } variant={ 'h4' }> { (this._getAPY(asset)/1).toFixed(2) }%</Typography>
                </div>
              }
            </div>
          } */}
          <div className={classes.heading}>
            <Typography variant={ 'h3' } noWrap className={classes.dataValue}>$ { parseFloat(asset.usdBalance ? (asset.usdBalance).toFixed(2) : '0.00').toLocaleString() }</Typography>
          </div>
        </div>
      </div>)
    })
  }

  renderEarn = () => {
    const { growth, currency } = this.state
    const { assets } = this.state.dashboard
    const { classes } = this.props

    if(!assets || assets.length === 0) {
      return null
    }

    return assets.map((asset) => {
      return (<div className={ classes.vault } key={asset.id}>
        <div className={ classes.assetSummary }>
          <div className={classes.headingName}>
            <div className={ classes.assetIcon }>
              <img
                alt=""
                src={ require('../../assets/'+asset.symbol+'-logo.png') }
                height={ '30px'}
              />
            </div>
            <div>
              <Typography variant={ 'h3' } noWrap>{ asset.name }</Typography>
              <Typography variant={ 'h5' } noWrap className={ classes.gray }>{ asset.description }</Typography>
            </div>
          </div>
          {/* { growth === 0 &&
            <div className={classes.heading}>
              <Typography variant={ 'h5' } className={ classes.gray }>Daily Growth</Typography>
              { currency === 'USD' &&
                <div className={ classes.inline }>
                  <Typography variant={ 'h3' } noWrap>$ { parseFloat(asset.earnGrowth_daily_usd.toFixed(2)).toLocaleString() }</Typography >
                  <Typography className={ classes.symbolAt } variant={ 'h4' }> @ </Typography>
                  <Typography className={ classes.symbol } variant={ 'h4' }> { (asset.maxApr ? (asset.maxApr*100/365).toFixed(2) : '0.00') }%</Typography>
                </div>
              }
              { currency === 'ETH' &&
                <div className={ classes.inline }>
                  <Typography variant={ 'h3' } noWrap>{ parseFloat(asset.earnGrowth_daily_eth.toFixed(2)).toLocaleString() }</Typography >
                  <Typography className={ classes.symbol } variant={ 'h4' }>ETH</Typography>
                  <Typography className={ classes.symbolAt } variant={ 'h4' }> @ </Typography>
                  <Typography className={ classes.symbol } variant={ 'h4' }> { (asset.maxApr ? (asset.maxApr*100/365).toFixed(2) : '0.00') }%</Typography>
                </div>
              }
            </div>
          }
          { growth === 1 &&
            <div className={classes.heading}>
              <Typography variant={ 'h5' } className={ classes.gray }>Weekly Growth</Typography>
              { currency === 'USD' &&
                <div className={ classes.inline }>
                  <Typography variant={ 'h3' } noWrap>$ { parseFloat(asset.earnGrowth_weekly_usd.toFixed(2)).toLocaleString() }</Typography >
                  <Typography className={ classes.symbolAt } variant={ 'h4' }> @ </Typography>
                  <Typography className={ classes.symbol } variant={ 'h4' }> { (asset.maxApr ? (asset.maxApr*100/52).toFixed(2) : '0.00') }%</Typography>
                </div>
              }
              { currency === 'ETH' &&
                <div className={ classes.inline }>
                  <Typography variant={ 'h3' } noWrap>{ parseFloat(asset.earnGrowth_weekly_eth.toFixed(2)).toLocaleString() }</Typography >
                  <Typography className={ classes.symbol } variant={ 'h4' }>ETH</Typography>
                  <Typography className={ classes.symbolAt } variant={ 'h4' }> @ </Typography>
                  <Typography className={ classes.symbol } variant={ 'h4' }> { (asset.maxApr ? (asset.maxApr*100/52).toFixed(2) : '0.00') }%</Typography>
                </div>
              }
            </div>
          }
          { growth === 2 &&
            <div className={classes.heading}>
              <Typography variant={ 'h5' } className={ classes.gray }>Yearly Growth</Typography>
              { currency === 'USD' &&
                <div className={ classes.inline }>
                  <Typography variant={ 'h3' } noWrap>$ { parseFloat(asset.earnGrowth_yearly_usd.toFixed(2)).toLocaleString() }</Typography >
                  <Typography className={ classes.symbolAt } variant={ 'h4' }> @ </Typography>
                  <Typography className={ classes.symbol } variant={ 'h4' }> { (asset.maxApr ? (asset.maxApr*100).toFixed(2) : '0.00') }%</Typography>
                </div>
              }
              { currency === 'ETH' &&
                <div className={ classes.inline }>
                  <Typography variant={ 'h3' } noWrap>{ parseFloat(asset.earnGrowth_yearly_eth.toFixed(2)).toLocaleString() }</Typography >
                  <Typography className={ classes.symbol } variant={ 'h4' }>ETH</Typography>
                  <Typography className={ classes.symbolAt } variant={ 'h4' }> @ </Typography>
                  <Typography className={ classes.symbol } variant={ 'h4' }> { (asset.maxApr ? (asset.maxApr*100).toFixed(2) : '0.00') }%</Typography>
                </div>
              }
            </div>
          } */}
          <div className={classes.heading}>
            {/* <Typography variant={ 'h5' } className={ classes.gray }>Net worth</Typography> */}
            { currency === 'USD' && <Typography variant={ 'h3' } noWrap>$ { parseFloat(asset.usdBalance ? (asset.usdBalance).toFixed(2) : '0.00').toLocaleString() }</Typography > }
            { currency === 'ETH' &&
              <div className={ classes.inline }>
                <Typography variant={ 'h3' } noWrap>{ parseFloat(asset.ethBalance ? (asset.ethBalance).toFixed(2) : '0.00').toLocaleString() }</Typography >
                <Typography className={ classes.symbol } variant={ 'h4' }>ETH</Typography>
              </div>
            }
          </div>
        </div>
      </div>)
    })
  }

  _getAPY = (asset) => {
    const { basedOn } = this.state

    if(asset && asset.stats) {
      switch (basedOn) {
        case 1:
          return asset.stats.apyOneWeekSample
        case 2:
          return asset.stats.apyOneMonthSample
        case 3:
          return asset.stats.apyInceptionSample
        default:
          return asset.apy
      }
    } else if (asset.apy) {
      return asset.apy
    } else {
      return '0.00'
    }
  }

  renderChart = () => {
    const { classes } = this.props;

    const options = {
      chart: {
        width: 800
      },
      title: {
        text: 'Historical Earn & Vault Performance'
      },
      series: [
        {
          name: 'Earn',
          data: [1, 2, 1, 4, 3, 6]
        },
        {
          name: 'Vault',
          data: [3, 1, 3, 4, 3, 8]
        }
      ],
      credits: {
        enabled: false
      }
    };

    return (
      <div className={classes.chartContainer}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  }

  addressClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }

}

  export default withRouter(withStyles(styles)(Dashboard));
