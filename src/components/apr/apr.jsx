import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Card,
  Grid,
  CircularProgress,
  Tooltip
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { colors } from '../../theme'

import {
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  GET_VAULT_BALANCES_FULL,
  VAULT_BALANCES_FULL_RETURNED,
} from '../../constants'

import Loader from '../loader'

import Store from "../../stores";
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
    alignItems: 'center',
    marginTop: '60px',
    [theme.breakpoints.up('md')]: {
      alignItems: 'center',
      marginTop: '0px',
    }
  },
  pairs: {
    padding: '42px 36px',
    borderRadius: '50px',
    border: '1px solid ' + colors.borderBlue,
    margin: '40px',
    width: 'calc(100% - 80px)'
  },
  pair: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(25, 101, 233, 0.2)',
    padding: '10px 0px'
  },
  name: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 0px',
    width: '240px',
    top: 'auto',
    cursor: 'pointer'
  },
  strategy: {
    display: 'flex',
    alignItems: 'center',
    top: 'auto',
    padding: '8px 0px',
    width: '160px',
    cursor: 'pointer'
  },
  apr1: {
    padding: '8px 0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1
  },
  apr2: {
    padding: '8px 0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 2
  },
  headerValue: {
    fontWeight: 'bold',
    padding: '8px 0px',
    flex: 2
  },
  headerHoldings: {
    fontWeight: 'bold',
    padding: '8px 0px',
    flex: 2
  },
  headerROI: {
    fontWeight: 'bold',
    padding: '8px 0px',
    flex: 3
  },
  headerName: {
    fontWeight: 'bold',
    padding: '8px 0px',
    width: '240px'
  },
  headerStrategy: {
    fontWeight: 'bold',
    padding: '8px 0px',
    width: '160px'
  },
  aggregatedHeader: {
    textAlign: 'left',
  },
  aggregatedHeaderCenter: {
    textAlign: 'center',
  },
  aggregatedHeaderRight: {
    textAlign: 'right',
  },
  tablesContainer: {
    display: 'flex',
    width: '100%'
  },
  tableContainer: {
    width: '100%'
  },
  assetIcon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    borderRadius: '20px',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    cursor: 'pointer',
    marginRight: '12px'
  },
  subHeader: {
    display: 'flex',
    width: '100%'
  },
  symbol: {
    color: colors.darkGray,
    paddingLeft: '6px'
  },
  preSymbol: {
    color: colors.darkGray,
    paddingRight: '6px'
  },
  inline: {
    display: 'flex'
  },
  statisticsContainer : {
    width: 'calc(100% - 80px)'
  },
  statisticCard : {
    padding: '42px 36px',
    borderRadius: '25px',
    border: '1px solid ' + colors.borderBlue,
    marginTop: '40px'
  },
  statistic: {
    fontSize: '24px'
  }
});

class APR extends Component {

  constructor() {
    super()

    const account = store.getStore('account')

    this.state = {
      assets: store.getStore('vaultAssets'),
      loading: true
    }

    if(account && account.address) {
      dispatcher.dispatch({ type: GET_VAULT_BALANCES_FULL, content: { } })
    }
  }

  componentWillMount() {
    emitter.on(VAULT_BALANCES_FULL_RETURNED, this.statisticsReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
  }

  componentWillUnmount() {
    emitter.removeListener(VAULT_BALANCES_FULL_RETURNED, this.statisticsReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
  };

  connectionConnected = () => {
    this.setState({
      account: store.getStore('account'),
      loading: true
    })
    dispatcher.dispatch({ type: GET_VAULT_BALANCES_FULL, content: { } })
  };

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account') })
  }

  statisticsReturned = (balances) => {
    this.setState({
      assets: store.getStore('vaultAssets'),
      loading: false
    })
  };

  render() {
    const { classes } = this.props
    const { loading } = this.state

    return (
      <div className={ classes.root }>

        { !loading && this.renderAggStats() }

        { !loading && 
          <Card className={ classes.pairs }>
            <table className={ classes.tableContainer }>
              <thead>
                { this.renderHeaders() }
              </thead>
              <tbody>
                { this.renderStats() }
              </tbody>
            </table>
          </Card>
        }

        { loading && <CircularProgress /> }

        { loading && <Loader /> }
      </div>
    )
  };

  renderAggStats = () => { 
    
    const { classes } = this.props

    return(
        <div className={classes.statisticsContainer}>
          <Grid container spacing={3}>
            <Grid item md={3}>
              <Card className={classes.statisticCard}>
                <b>
                  Total Value Locked (TVL)
                </b>
                <div>
                  { this.renderStatTh() }
                </div>
              </Card>
            </Grid>
            <Grid item md={3}>
              <Card className={classes.statisticCard}>
                <b>Vault Holdings</b>
                <Tooltip title="Total assets held in vaults, excluding assets that are deployed into other protocols" arrow>
                    <InfoIcon fontSize="small" style={{ color: colors.darkGray, marginLeft: '5px', marginBottom: '-5px' }} />
                  </Tooltip>
                <div>
                  { this.renderStatTsh() }
                </div>
              </Card>
            </Grid>
            <Grid item md={3}>
              <Card className={classes.statisticCard}>
                <b>
                  Strategy Holdings
                  <Tooltip title="Total assets deployed to other protocols as part of vault strategies" arrow>
                    <InfoIcon fontSize="small" style={{ color: colors.darkGray, marginLeft: '5px', marginBottom: '-5px' }} />
                  </Tooltip>
                </b> 
                <div>
                  { this.renderStatTvh() }
                </div>
              </Card>
            </Grid>
            <Grid item md={3}>
              <Card className={classes.statisticCard}>
                <b>
                  Annual Yield
                  <Tooltip title="Average annual yield (unstable) based on 1 month sampled period, across active vaults" arrow>
                    <InfoIcon fontSize="small" style={{ color: colors.darkGray, marginLeft: '5px', marginBottom: '-5px' }} />
                  </Tooltip>
                </b>
                <div>
                  { this.renderStatRevenue() } 
                </div>
              </Card>
            </Grid>
          </Grid>
        </div>
      )

  }

  renderStatTh = () => {
    const { classes } = this.props
    const { assets } = this.state

    var statTvl = 0

    assets.filter((asset) => {
      return asset.symbol !== 'ETH';
    }).forEach((asset) => {
      statTvl += asset.vaultHoldings ? asset.vaultHoldings * asset.usdPrice : 0
      statTvl += asset.strategyHoldings ? asset.strategyHoldings * asset.usdPrice : 0
    })

    return (
      <span className={classes.statistic}>
        { '$' + parseFloat( statTvl.toFixed(2) ).toLocaleString() }
      </span>
    )
}

  renderStatTvh = () => {
      const { classes } = this.props
      const { assets } = this.state

      var statTvl = 0

      assets.filter((asset) => {
        return asset.symbol !== 'ETH';
      }).forEach((asset) => {
        statTvl += asset.vaultHoldings ? asset.vaultHoldings * asset.usdPrice : 0
      })
  
      return (
        <span className={classes.statistic}>
          { '$' + parseFloat( statTvl.toFixed(2) ).toLocaleString() }
        </span>
      )
  }

  renderStatTsh = () => {
    const { classes } = this.props
    const { assets } = this.state

    var statTvl = 0

    assets.filter((asset) => {
      return asset.symbol !== 'ETH';
    }).forEach((asset) => {
      statTvl += asset.strategyHoldings ? asset.strategyHoldings * asset.usdPrice : 0
    })

    return (
      <span className={classes.statistic}>
        { '$' + parseFloat( statTvl.toFixed(2) ).toLocaleString() }
      </span>
    )
  }

  renderStatRevenue = () => {
    const { classes } = this.props
    const { assets } = this.state

    var statTvl = 0
    var statYield = 0
    var assetTvl = 0
    var assetYield = 0

    assets.filter((asset) => {
      return asset.symbol !== 'ETH' && asset.depositDisabled !== true; // For yield, calculate only on active vaults
    }).forEach((asset) => {
      assetTvl = 0
      assetTvl += asset.vaultHoldings ? asset.vaultHoldings * asset.usdPrice : 0
      assetTvl += asset.strategyHoldings ? asset.strategyHoldings * asset.usdPrice : 0

      assetYield = asset.stats.apyOneMonthSample ? assetTvl * (asset.stats.apyOneMonthSample / 100) : 0

      if ( assetYield > 0 ) { 
        statTvl += assetTvl
        statYield += assetYield
      }
    })

    var statApy = statYield / statTvl

    return (
      <span className={classes.statistic}>
        { ( statApy * 100 ).toFixed(2) }%
        <span style={{ fontSize: '0.7em', color: colors.darkGray, paddingLeft: '6px' }}>{ '$' + parseFloat( statYield.toFixed(2) ).toLocaleString() }</span>
      </span>
    )
  }

  renderHeaders = () => {
    const { classes } = this.props

    return (
      <tr className={ classes.pair }>
        <th className={ classes.headerName }>
          <Typography  align='right' variant={'h4'} className={classes.aggregatedHeader}>{ 'Vault' }</Typography>
        </th>
        <th className={ classes.headerStrategy }>
          <Typography  align='right' variant={'h4'} className={classes.aggregatedHeader}>{ 'Current Strategy' }</Typography>
        </th>
        <th className={ classes.headerValue }>
          <Typography  align='right' variant={'h4'} className={classes.aggregatedHeaderRight}>{ 'Vault holdings' }</Typography>
        </th>
        <th className={ classes.headerValue }>
          <Typography  align='right' variant={'h4'} className={classes.aggregatedHeaderRight}>{ 'Strategy holdings' }</Typography>
        </th>
        <th className={ classes.headerHoldings }>
          <Typography  align='right' variant={'h4'} className={classes.aggregatedHeaderRight}>{ 'Your holdings' }</Typography>
          <div className={ classes.subHeader }>
            <div className={ classes.headerValue }>
              <Typography  align='right' variant={'h4'} className={classes.aggregatedHeaderRight}>{ 'Token' }</Typography>
            </div>
            <div className={ classes.headerValue }>
              <Typography  align='right' variant={'h4'} className={classes.aggregatedHeaderRight}>{ 'USD' }</Typography>
            </div>
          </div>
        </th>
        <th className={ classes.headerROI }>
          <Typography  align='right' variant={'h4'} className={classes.aggregatedHeaderCenter}>{ 'ROI based on sampled period' }</Typography>
          <div className={ classes.subHeader }>
            <div className={ classes.headerValue }>
              <Typography  align='right' variant={'h4'} className={classes.aggregatedHeaderRight}>{ '1 Week' }</Typography>
            </div>
            <div className={ classes.headerValue }>
              <Typography  align='right' variant={'h4'} className={classes.aggregatedHeaderRight}>{ '1 Month' }</Typography>
            </div>
            <div className={ classes.headerValue }>
              <Typography  align='right' variant={'h4'} className={classes.aggregatedHeaderRight}>{ 'Inception' }</Typography>
            </div>
          </div>
        </th>
      </tr>
    )
  }

  renderStats = () => {
    const { classes } = this.props
    const { assets } = this.state

    return (
      assets.filter((asset) => {
        return asset.symbol !== 'ETH';
      }).map((asset) => {

        return (
          <tr key={ asset.id } className={ classes.pair }>
            <td className={ classes.name } onClick={() => { window.open(`https://etherscan.io/address/${asset.vaultContractAddress}#code`, "_blank")} }>
              <div className={ classes.assetIcon }>
                <img
                  alt=""
                  src={ require('../../assets/'+asset.symbol+'-logo.png') }
                  height="30px"
                />
              </div>
              <Typography align='right' variant={'h4'} >{ asset.name }</Typography>
            </td>
            <td className={ classes.strategy } onClick={() => { window.open(`https://etherscan.io/address/${asset.strategy}#code`, "_blank")} }>
              <Typography align='right' variant='h5'>{ asset.strategyName }</Typography>
            </td>
            <td className={ classes.apr2 }>
              <Typography align='right' variant='h5' className={ classes.inline }>{ asset.vaultHoldings ? parseFloat(asset.vaultHoldings.toFixed(2)).toLocaleString() : '0.00'  } <div className={classes.symbol}>{ asset.symbol }</div></Typography>
            </td>
            <td className={ classes.apr2 }>
              <Typography align='right' variant='h5' className={ classes.inline }>{ asset.strategyHoldings ? parseFloat(asset.strategyHoldings.toFixed(2)).toLocaleString() : '0.00' } <div className={classes.symbol}>{ asset.symbol }</div></Typography>
            </td>
            <td className={ classes.apr1 }>
              <Typography align='right' variant='h5' className={ classes.inline }>{ asset.vaultBalance ? parseFloat((asset.vaultBalance*asset.pricePerFullShare).toFixed(2)).toLocaleString() : '0.00' } <div className={classes.symbol}>{ asset.symbol }</div></Typography>
            </td>
            <td className={ classes.apr1 }>
              <Typography align='right' variant='h5' className={ classes.inline }><div className={classes.preSymbol}>$</div>{ asset.vaultBalance ? parseFloat((asset.vaultBalance*asset.pricePerFullShare*asset.usdPrice).toFixed(2)).toLocaleString() : '0.00' }</Typography>
            </td>
            <td className={ classes.apr1 }>
              <Typography align='right' variant='h5' className={ classes.inline }>{ asset.stats && asset.stats.apyOneWeekSample ? parseFloat(asset.stats.apyOneWeekSample.toFixed(2)).toLocaleString() : '0.00' }<div className={classes.symbol}>%</div></Typography>
            </td>
            <td className={ classes.apr1 }>
              <Typography align='right' variant='h5' className={ classes.inline }>{ asset.stats && asset.stats.apyOneMonthSample ? parseFloat(asset.stats.apyOneMonthSample.toFixed(2)).toLocaleString() : '0.00' }<div className={classes.symbol}>%</div></Typography>
            </td>
            <td className={ classes.apr1 }>
              <Typography align='right' variant='h5' className={ classes.inline }>{ asset.stats && asset.stats.apyInceptionSample ? parseFloat(asset.stats.apyInceptionSample.toFixed(2)).toLocaleString() : '0.00' }<div className={classes.symbol}>%</div></Typography>
            </td>
          </tr>)
      })
    )
  }
}

export default withRouter(withStyles(styles)(APR));
