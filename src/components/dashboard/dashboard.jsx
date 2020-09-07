import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import * as moment from 'moment';
import {
  Typography,
  Tooltip
} from '@material-ui/core';
import { colors } from '../../theme'

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
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1200px',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  investedContainerLoggedOut: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100%',
    marginTop: '40px',
    [theme.breakpoints.up('md')]: {
      minWidth: '900px',
    }
  },
  investedContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: '100%',
    marginTop: '40px',
    [theme.breakpoints.up('md')]: {
      minWidth: '900px',
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
    marginTop: '40px',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    background: colors.white,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
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
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    background: colors.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  growth: {
    cursor: 'pointer'
  },
  prettyAlign: {
    display: 'flex',
    alignItems: 'center'
  },
  infoIcon: {
    fontSize: '1em',
    marginLeft: '6px'
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
    display: 'none',
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
    padding: '12px',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  sectionHeading: {
    color: colors.darkGray,
    width: '100%',
    marginLeft: '54px'
  },
  inline: {
    display: 'flex',
    alignItems: 'baseline'
  },
  symbol: {
    paddingLeft: '6px'
  }
});

class Dashboard extends Component {

  constructor(props) {
    super()

    const dashboard = store.getStore('dashboard')

    this.state = {
      dashboard: dashboard,
      loading: true,
      growth: 1 // 0=daily 1=weekly 2=yearly
    }

    dispatcher.dispatch({ type: GET_DASHBOARD_SNAPSHOT, content: {} })
  }

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(DASHBOARD_SNAPSHOT_RETURNED, this.dashboardSnapshotReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(DASHBOARD_SNAPSHOT_RETURNED, this.dashboardSnapshotReturned);
  };

  dashboardSnapshotReturned = () => {
    this.setState({
      loading: false,
      dashboard: store.getStore('dashboard')
    })
  }

  connectionConnected = () => {
    dispatcher.dispatch({ type: GET_DASHBOARD_SNAPSHOT, content: {} })
  };

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  render() {
    const { classes } = this.props;
    const {
      loading,
      dashboard,
      growth
    } = this.state

    return (
      <div className={ classes.root }>
        <div className={ classes.investedContainer}>
          <div className={ classes.portfolioContainer }>
            <div className={ classes.titleBalance }>
              <Typography variant={ 'h2' }>$ { parseFloat(dashboard.portfolio_balance_usd.toFixed(2)).toLocaleString() }</Typography>
              <Typography variant={ 'h4' } className={ classes.gray }>Portfolio Balance</Typography>
            </div>
            <div className={ classes.between }>
            </div>
            <div className={ `${classes.titleBalance} ${classes.growth}` } onClick={ this.growthClicked }>
              { growth === 0 && <Typography variant={ 'h2' }>$ { parseFloat(dashboard.portfolio_growth_usd_daily.toFixed(2)).toLocaleString() }</Typography> }
              { growth === 0 &&
                <Typography variant={ 'h4' } className={ `${classes.gray} ${classes.prettyAlign}` }>
                  Daily Growth
                  <Tooltip title="Estimated - based on the vault's perfomance since the vault was created" arrow>
                    <InfoIcon className={ classes.infoIcon } />
                  </Tooltip>
                </Typography>
              }
              { growth === 1 && <Typography variant={ 'h2' }>$ { parseFloat(dashboard.portfolio_growth_usd_weekly.toFixed(2)).toLocaleString() }</Typography> }
              { growth === 1 &&
                <Typography variant={ 'h4' } className={ `${classes.gray} ${classes.prettyAlign}` }>
                  Weekly Growth
                  <Tooltip title="Estimated - based on the vault's perfomance since the vault was created" arrow>
                    <InfoIcon className={ classes.infoIcon } />
                  </Tooltip>
                </Typography> }

              { growth === 2 && <Typography variant={ 'h2' }>$ { parseFloat(dashboard.portfolio_growth_usd_yearly.toFixed(2)).toLocaleString() }</Typography> }
              { growth === 2 &&
                <Typography variant={ 'h4' } className={ `${classes.gray} ${classes.prettyAlign}` }>
                  Yearly Growth
                  <Tooltip title="Estimated - based on the vault's perfomance since the vault was created" arrow>
                    <InfoIcon className={ classes.infoIcon } />
                  </Tooltip>
                </Typography> }
            </div>
          </div>
          <div className={ classes.vaultContainer }>
            <Typography variant={ 'h3' } className={ classes.sectionHeading }>Vaults Overview</Typography>
            { this.renderVaults() }
          </div>
          <div className={ classes.earnContainer }>
            <Typography variant={ 'h3' } className={ classes.sectionHeading }>Earn Overview</Typography>
            { this.renderEarn() }
          </div>
        </div>
        { loading && <Loader /> }
      </div>
    )
  };

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
  }

  renderVaults = () => {
    const { growth } = this.state
    const { vaults } = this.state.dashboard
    const { classes } = this.props

    if(!vaults || vaults.length === 0) {
      return null
    }

    return vaults.map((asset) => {
      return (<div className={ classes.vault }>
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
          <div className={classes.heading}>
            { growth === 0 && <Typography variant={ 'h5' } className={ classes.gray }>Daily Growth</Typography> }
            { growth === 0 && <Typography variant={ 'h3' } noWrap>{ (asset.apy ? (asset.apy/365).toFixed(2) : '0.00') }% </Typography> }

            { growth === 1 && <Typography variant={ 'h5' } className={ classes.gray }>Weekly Growth</Typography> }
            { growth === 1 && <Typography variant={ 'h3' } noWrap>{ (asset.apy ? (asset.apy/52).toFixed(2) : '0.00') }% </Typography> }

            { growth === 2 && <Typography variant={ 'h5' } className={ classes.gray }>Yearly Growth</Typography> }
            { growth === 2 && <Typography variant={ 'h3' } noWrap>{ (asset.apy ? (asset.apy).toFixed(2) : '0.00') }% </Typography> }
          </div>
          <div className={classes.heading}>
            <Typography variant={ 'h5' } className={ classes.gray }>Invested</Typography>
            <div className={ classes.inline }>
              <Typography variant={ 'h3' } noWrap>{ parseFloat(asset.vaultBalance ? (asset.vaultBalance).toFixed(2) : '0.00').toLocaleString() }</Typography ><Typography className={ classes.symbol } variant={ 'h5' }>{asset.vaultSymbol}</Typography>
            </div>
          </div>
        </div>
      </div>)
    })
  }

  renderEarn = () => {
    const { growth } = this.state
    const { assets } = this.state.dashboard
    const { classes } = this.props

    if(!assets || assets.length === 0) {
      return null
    }

    return assets.map((asset) => {
      return (<div className={ classes.vault }>
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
          <div className={classes.heading}>
            { growth === 0 && <Typography variant={ 'h5' } className={ classes.gray }>Daily Growth</Typography> }
            { growth === 0 && <Typography variant={ 'h3' } noWrap>{ (asset.maxApr ? (asset.maxApr*100/365).toFixed(2) : '0.00') }% </Typography> }

            { growth === 1 && <Typography variant={ 'h5' } className={ classes.gray }>Weekly Growth</Typography> }
            { growth === 1 && <Typography variant={ 'h3' } noWrap>{ (asset.maxApr ? (asset.maxApr*100/52).toFixed(2) : '0.00') }% </Typography> }

            { growth === 2 && <Typography variant={ 'h5' } className={ classes.gray }>Yearly Growth</Typography> }
            { growth === 2 && <Typography variant={ 'h3' } noWrap>{ (asset.maxApr ? (asset.maxApr*100).toFixed(2) : '0.00') }% </Typography> }
          </div>
          <div className={classes.heading}>
            <Typography variant={ 'h5' } className={ classes.gray }>Invested</Typography>
            <div className={ classes.inline }>
              <Typography variant={ 'h3' } noWrap>{ parseFloat(asset.investedBalance ? (asset.investedBalance).toFixed(2) : '0.00').toLocaleString() }</Typography ><Typography className={ classes.symbol } variant={ 'h5' }>{asset.investSymbol}</Typography>
            </div>
          </div>
        </div>
      </div>)
    })
  }

}

  export default withRouter(withStyles(styles)(Dashboard));
