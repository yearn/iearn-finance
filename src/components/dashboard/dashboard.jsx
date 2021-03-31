import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  MenuItem,
  Grid,
  Button
} from '@material-ui/core';
import { colors, drawerWidth } from '../../theme'

import Loader from '../loader'

import {
  ERROR,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  GET_DASHBOARD_SNAPSHOT,
  DASHBOARD_SNAPSHOT_RETURNED,
} from '../../constants'
import * as moment from 'moment';
import _ from 'lodash';

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
  connectWalletContainer: {
    minWidth: '100%',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    [theme.breakpoints.up('md')]: {
      minWidth: 'calc(100% - '+ drawerWidth + 'px)',
    },
    [theme.breakpoints.down('md')]: {
      paddingTop: '2rem'
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
    width: '50%',
    margin: 'auto',
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
      width: '80%'
    }
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
  },
  periodContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 0px 12px 0px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  period: {
    width: '33%',
    color: '#777777',
  },
  periodActive: {
    minWidth: '33%',
    color: '#222222',
    background: 'rgba(24, 160, 251, 0.2)',
    borderRadius: '5px'
  },
  titleDesc: {
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: '1rem 2rem'
    }
  },
  alertDesc: {
    textAlign: 'center',
    width: '65%',
    margin: 'auto',
    whiteSpace: 'normal',
    fontWeight: 'bold',
    [theme.breakpoints.down('md')]: {
      width: '85%'
    }
  },
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
      basedOn: basedOn ? parseInt(basedOn > 3 ? 3 : basedOn) : 1, // 1=apyOneWeekSample  2= apyInceptionSample  3=apyInceptionSample (old)
      modalOpen: false,
      period: '1d'
    }

    if(account && account.address) {
      dispatcher.dispatch({ type: GET_DASHBOARD_SNAPSHOT, content: { interval: this.state.period } })
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
    const { period } = this.state;
    const account = store.getStore('account')
    this.setState({ loading: true, account: account })
    dispatcher.dispatch({ type: GET_DASHBOARD_SNAPSHOT, content: { interval: period } })
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
          <div className={classes.connectWalletContainer}>
            <div>
              <Typography variant={'h2'} className={classes.welcomeText}>Welcome to DAOventures</Typography>
              <Typography className={classes.titleDesc} variant={'body1'}>Connect an Ethereum wallet to manage and invest your DeFi portfolio</Typography>
              <Typography variant='body1' className={classes.alertDesc}>Alert: The deposit into any of investment strategies will incur high gas fees due to Ethereum network</Typography>
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
            {this.renderChart(dashboard)}
            <Grid container spacing={1} className={ classes.portfolioContainer }>
              <Grid item sm={6} xs={6} className={ classes.titleBalance }>
                <Typography variant={ 'h4' } className={`${classes.gray} ${classes.labelSize}`}>Portfolio Balance</Typography>
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
                    <Typography variant={ 'h3' } className={ classes.sectionHeading }>My Portfolio</Typography>
                  </div>
                  { this.renderBasedOn() }
                </div>
                <Typography variant={ 'caption' } className={ classes.netWorth }>NET BALANCE</Typography>

                { this.renderVaults() }
              </div>
            }
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
        description: '1 year'
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
    const { period } = this.state;
    val[event.target.name] = event.target.value
    this.setState(val)

    localStorage.setItem('yearn.finance-dashboard-basedon', event.target.value)

    this.setState({ loading: true })
    dispatcher.dispatch({ type: GET_DASHBOARD_SNAPSHOT, content: { interval: period } })
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
                src={ require('../../assets/'+asset.symbol+'-logo.'+asset.logoFormat) }
                height={ '30px'}
              />
            </div>
            <div>
              <Typography variant={ 'h5' } noWrap className={classes.assetName}>{ asset.name }</Typography>
              <Typography variant={ 'h5' } noWrap className={ classes.gray }>{ asset.description }</Typography>
            </div>
          </div>
          <div className={classes.heading}>
            <Typography variant={ 'h3' } noWrap className={classes.dataValue}>$ { parseFloat(asset.usdBalance ? (asset.usdBalance).toFixed(2) : '0.00').toLocaleString() }</Typography>
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

  renderChart = (dashboard) => {
    const { classes } = this.props;
    const { period } = this.state;
    let dataSet = [];

    if (dashboard.totalPerformance) {
      dashboard.totalPerformance.map(balance => {
        balance[1] = parseFloat(balance[1].toFixed(4))
        return balance;
      });

     let startTime = dashboard.totalPerformance[0][0];
     var temp;
      switch (period) {
        case '1d':
          temp = _.groupBy(dashboard.totalPerformance, (d) => {
            return Math.floor((d[0]-startTime)/(1000*60*60*24))
          });
          Object.keys(temp).forEach(l => {
            dataSet.push([temp[l][temp[l].length - 1][0], temp[l][temp[l].length - 1][1]]);
          })
          break;
        case '7d':
          temp = _.groupBy(dashboard.totalPerformance, (d) => {
            return Math.floor((d[0]-startTime)/(1000*60*60*24*7))
          });
          Object.keys(temp).forEach(l => {
            dataSet.push([temp[l][temp[l].length - 1][0], temp[l][temp[l].length - 1][1]]);
          })
          break;
        case '30d':
          temp = _.groupBy(dashboard.totalPerformance, (d) => {
            return Math.floor((d[0]-startTime)/(1000*60*60*24*30))
          });
          Object.keys(temp).forEach(l => {
            dataSet.push([temp[l][temp[l].length - 1][0], temp[l][temp[l].length - 1][1]]);
          })
          break;
        default: 
      }
    }

    const options = {
      chart: {
        width: 800,
        type: 'area'
      },
      title: {
        text: ''
      },
      series: [
        {
          name: '',
          data: dataSet
        },
      ],
      tooltip: {
        formatter: function() {
          return moment.unix(this.x/1000).format('DD-MM-YYYY') 
            + '<br/>' +
            '<span style="color:' + this.point.color +'">\u25CF</span> ' + 
            '<b>' + this.y + '</b>';
        }
      },
      xAxis: {
        labels: {
          formatter: function() {
            return moment.unix(this.value/1000).format('DD-MM-YYYY');
          }
        }
      },
      yAxis: {
        title: {
          text: ''
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      }
    };

    return (
      <div className={classes.chartContainer}>
        <Grid container style={{display: 'flex', alignItems: 'center'}}>
          <Grid item sm={9} xs={9}>
            <Typography variant='body1'>Portfolio Performance</Typography>
          </Grid>
          <Grid item sm={3} xs={3} className={classes.periodContainer}>
            <Button
              className={ period === '1d' ? classes.periodActive : classes.period }
              variant='text'
              color="primary"
              onClick={ () => { this.setChartPeriod('1d') } }>
              <Typography variant={'h5'}>1D</Typography>
            </Button>
            <Button
              className={ period === '7d' ? classes.periodActive : classes.period }
              variant='text'
              color="primary"
              onClick={ () => { this.setChartPeriod('7d') } }>
              <Typography variant={'h5'}>1W</Typography>
            </Button>
            <Button
              className={ period === '30d' ? classes.periodActive : classes.period }
              variant='text'
              color="primary"
              onClick={ () => { this.setChartPeriod('30d') } }>
              <Typography variant={'h5'}>1M</Typography>
            </Button>
          </Grid>
        </Grid>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  }

  setChartPeriod = (period) => {
    this.setState({
      period
    })
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
