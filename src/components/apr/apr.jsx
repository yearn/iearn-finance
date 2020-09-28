import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Card,
} from '@material-ui/core';
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
    const { classes } = this.props;
    const { loading } = this.state

    return (
      <div className={ classes.root }>
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
        { loading && <Loader /> }
      </div>
    )
  };

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
          <Typography  align='right' variant={'h4'} className={classes.aggregatedHeaderRight}>{ 'Your holdings ( Token & USD)' }</Typography>
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
        return asset.symbol !== 'ETH'
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
