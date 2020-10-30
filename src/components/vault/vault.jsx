import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Tooltip,
  MenuItem
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import TimelineIcon from '@material-ui/icons/Timeline';
import InfoIcon from '@material-ui/icons/Info';
import HelpIcon from '@material-ui/icons/Help';
import { withNamespaces } from 'react-i18next';
import { colors } from '../../theme'

import Snackbar from '../snackbar'
import Asset from './asset'
import Loader from '../loader'

import {
  ERROR,
  GET_VAULT_BALANCES_FULL,
  VAULT_BALANCES_FULL_RETURNED,
  DEPOSIT_VAULT_RETURNED,
  WITHDRAW_VAULT_RETURNED,
  DEPOSIT_ALL_VAULT_RETURNED,
  WITHDRAW_ALL_VAULT_RETURNED,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED
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
    justifyContent: 'center',
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
  balancesContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    padding: '12px 12px',
    position: 'relative',
  },
  connectContainer: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '450px',
    [theme.breakpoints.up('md')]: {
      width: '450',
    }
  },
  intro: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: '32px',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      maxWidth: 'calc(100vw - 24px)',
      flexWrap: 'wrap'
    }
  },
  introCenter: {
    maxWidth: '500px',
    textAlign: 'center',
    display: 'flex',
    padding: '24px 0px'
  },
  introText: {
    paddingLeft: '20px'
  },
  actionButton: {
    '&:hover': {
      backgroundColor: "#2F80ED",
    },
    padding: '12px',
    backgroundColor: "#2F80ED",
    border: '1px solid #E1E1E1',
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      padding: '15px',
    }
  },
  heading: {
    display: 'none',
    flex: 1,
    [theme.breakpoints.up('md')]: {
      display: 'block'
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
  headingEarning: {
    display: 'none',
    width: '300px',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  buttonText: {
    fontWeight: '700',
    color: 'white',
  },
  assetSummary: {
    display: 'flex',
    alignItems: 'center',
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
    marginRight: '20px',
    [theme.breakpoints.up('sm')]: {
      height: '40px',
      width: '40px',
      marginRight: '24px',
    }
  },
  addressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
    flex: 1,
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    textOverflow:'ellipsis',
    cursor: 'pointer',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    alignItems: 'center',
    maxWidth: '450px',
    [theme.breakpoints.up('md')]: {
      width: '100%'
    }
  },
  between: {
    width: '40px'
  },
  expansionPanel: {
    maxWidth: 'calc(100vw - 24px)',
    width: '100%'
  },
  versionToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tableHeadContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  investAllContainer: {
    paddingTop: '24px',
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%'
  },
  disaclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    marginBottom: '24px',
    lineHeight: '1.2',
    background: colors.white,
    '& a' : {
      color: colors.black,
      textDecoration: 'none',
      fontWeight: 'bold',
    },
    '& a:hover' : {
      textDecoration: 'underline',
    },
  },
  fees: {
    paddingRight: '75px',
    padding: '12px',
    lineHeight: '1.2',
  },
  walletAddress: {
    padding: '0px 12px'
  },
  walletTitle: {
    flex: 1,
    color: colors.darkGray
  },
  grey: {
    color: colors.darkGray
  },
  filters: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: '0px 12px'
    },
  },
  searchField: {
    flex: 1,
    background: colors.white,
    borderRadius: '50px'
  },
  checkbox: {
    flex: 1,
    margin: '0px !important'
  },
  flexy: {
    display: 'flex',
    alignItems: 'center'
  },
  on: {
    color: colors.darkGray,
    padding: '0px 6px'
  },
  positive: {
    color: colors.compoundGreen
  },
  basedOnContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  infoIcon: {
    fontSize: '1em',
    marginRight: '6px'
  },
  removePadding: {
    padding: '0px',
    maxWidth: '900px'
  }
});

class Vault extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')
    const basedOn = localStorage.getItem('yearn.finance-dashboard-basedon')

    this.state = {
      assets: store.getStore('vaultAssets'),
      usdPrices: store.getStore('usdPrices'),
      account: account,
      address: account.address ? account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length) : null,
      snackbarType: null,
      snackbarMessage: null,
      search: '',
      searchError: false,
      hideZero: localStorage.getItem('yearn.finance-hideZero') === '1' ? true : false,
      basedOn: basedOn ? parseInt(basedOn > 3 ? 3 : basedOn) : 1,
      loading: true
    }

    if(account && account.address) {
      dispatcher.dispatch({ type: GET_VAULT_BALANCES_FULL, content: {} })
    }
  }
  componentWillMount() {
    emitter.on(DEPOSIT_VAULT_RETURNED, this.showHash);
    emitter.on(WITHDRAW_VAULT_RETURNED, this.showHash);
    emitter.on(DEPOSIT_ALL_VAULT_RETURNED, this.showHash);
    emitter.on(WITHDRAW_ALL_VAULT_RETURNED, this.showHash);
    emitter.on(ERROR, this.errorReturned);
    emitter.on(VAULT_BALANCES_FULL_RETURNED, this.balancesReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
  }

  componentWillUnmount() {
    emitter.removeListener(DEPOSIT_VAULT_RETURNED, this.showHash);
    emitter.removeListener(WITHDRAW_VAULT_RETURNED, this.showHash);
    emitter.removeListener(DEPOSIT_ALL_VAULT_RETURNED, this.showHash);
    emitter.removeListener(WITHDRAW_ALL_VAULT_RETURNED, this.showHash);
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(VAULT_BALANCES_FULL_RETURNED, this.balancesReturned);
  };

  balancesReturned = (balances) => {
    this.setState({
      assets: store.getStore('vaultAssets') ,
      loading: false
    })
  };

  connectionConnected = () => {
    const { t } = this.props
    const account = store.getStore('account')

    this.setState({
      loading: true,
      account: account,
      address: account.address ? account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length) : null
    })


    dispatcher.dispatch({ type: GET_VAULT_BALANCES_FULL, content: {} })

    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: t("Unlock.WalletConnected"), snackbarType: 'Info' }
      that.setState(snackbarObj)
    })
  };

  connectionDisconnected = () => {
    this.setState({
      account: null,
      address: null
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
    const { classes } = this.props;
    const {
      loading,
      account,
      snackbarMessage,
    } = this.state

    if(!account || !account.address) {
      return (
        <div className={ classes.root }>
          <div className={ classes.investedContainerLoggedOut }>
          <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>
            <div className={ classes.introCenter }>
              <Typography variant='h3'>Connect your wallet to continue</Typography>
            </div>
          </div>
          { snackbarMessage && this.renderSnackbar() }
        </div>
      )
    }

    return (
      <div className={ classes.root }>
        <div className={ classes.investedContainer }>
          <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>
          { this.renderFilters() }
          { this.renderBasedOn() }
          { this.renderAssetBlocks() }
          { this.renderStrategyRewards() }
        </div>
        { loading && <Loader /> }
        { snackbarMessage && this.renderSnackbar() }
      </div>
    )
  };

  onSearchChanged = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.checked
    this.setState(val)
  };

  renderAssetBlocks = () => {
    const { assets, expanded, search, hideZero, basedOn } = this.state
    const { classes } = this.props
    const width = window.innerWidth

    return assets.filter((asset) => {
      if(hideZero && (asset.balance === 0 && asset.vaultBalance === 0)) {
        return false
      }

      if(search && search !== '') {
        return asset.id.toLowerCase().includes(search.toLowerCase()) ||
              asset.name.toLowerCase().includes(search.toLowerCase()) ||
              asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
              asset.description.toLowerCase().includes(search.toLowerCase()) ||
              asset.vaultSymbol.toLowerCase().includes(search.toLowerCase())
              // asset.erc20address.toLowerCase().includes(search.toLowerCase()) ||
              // asset.vaultContractAddress.toLowerCase().includes(search.toLowerCase())
      } else {
        return true
      }
    }).map((asset) => {
      return (
        <Accordion className={ classes.expansionPanel } square key={ asset.id+"_expand" } expanded={ expanded === asset.id} onChange={ () => { this.handleChange(asset.id) } }>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <div className={ classes.assetSummary }>
              <div className={classes.headingName}>
                <div className={ classes.assetIcon }>
                  <img
                    alt=""
                    src={ require('../../assets/'+asset.symbol+'-logo.png') }
                    height={ width > 600 ? '40px' : '30px'}
                    style={asset.disabled?{filter:'grayscale(100%)'}:{}}
                  />
                </div>
                <div>
                  <Typography variant={ 'h3' } noWrap>{ asset.name }</Typography>
                  <Typography variant={ 'h5' } className={ classes.grey }>{ asset.description }</Typography>
                </div>
              </div>
              {
                (!['LINK'].includes(asset.id) && !['GUSD'].includes(asset.id) && asset.vaultBalance > 0) &&
                <div className={classes.headingEarning}>
                  <Typography variant={ 'h5' } className={ classes.grey }>Yearly Growth:</Typography>
                  <div className={ classes.flexy }>
                    <Typography variant={ 'h3' } noWrap>{ (this._getAPY(asset)/1).toFixed(2) }% </Typography>
                    <Typography variant={ 'h5' } className={ classes.on }> on </Typography>
                    <Typography variant={ 'h3' } noWrap>{ (asset.vaultBalance ? (Math.floor(asset.vaultBalance*asset.pricePerFullShare*10000)/10000).toFixed(2) : '0.00') } {asset.symbol}</Typography>
                  </div>
                </div>
              }
              {
                (!['LINK'].includes(asset.id) && !['GUSD'].includes(asset.id) && asset.vaultBalance === 0) &&
                <div className={classes.headingEarning}>
                  <Typography variant={ 'h5' } className={ classes.grey }>Yearly Growth:</Typography>
                  <div className={ classes.flexy }>
                    <Typography variant={ 'h3' } noWrap>{ (this._getAPY(asset)/1).toFixed(2) }% </Typography>
                  </div>
                </div>
              }
              {
                ['LINK'].includes(asset.id) &&
                <div className={classes.headingEarning}>
                  <Typography variant={ 'h5' } className={ classes.grey }>Yearly Growth:</Typography>
                  <Typography variant={ 'h3' } noWrap>Not Available</Typography>
                </div>
              }
              {
                ['GUSD'].includes(asset.id) &&
                <div className={classes.headingEarning}>
                  <Typography variant={ 'h5' } className={ classes.grey }>Yearly Growth:</Typography>
                  <Typography variant={ 'h3' }  noWrap>
                    Not Available
                    <Tooltip title="The GUSD strategy is temporally disabled due to misleading APY calculation. It is safe to withdraw your funds, you are not charged 0.5% withdrawal fee." arrow>
                      <InfoIcon fontSize="small" style={{ color: colors.darkGray, marginLeft: '5px', marginBottom: '-5px' }} />
                    </Tooltip>
                  </Typography>
                </div>
              }
              { !(asset.depositDisabled === true) &&
                <div className={classes.heading}>
                  <Typography variant={ 'h5' } className={ classes.grey }>Available to deposit:</Typography>
                  <Typography variant={ 'h3' } noWrap>{ (asset.balance ? (asset.balance).toFixed(2) : '0.00')+' '+asset.symbol }</Typography>
                </div>
              }

              { asset.depositDisabled === true &&
                <div className={classes.heading}>
                  <Tooltip title={
                      <React.Fragment>
                        <Typography variant={'h5'} className={ classes.fees }>
                          This vault is currently inactive and is not taking deposits. 
                        </Typography>
                      </React.Fragment>
                    } arrow>
                  <Grid container spacing={1} direction="row" alignItems="center">

                    
                      <Grid item>
                          <HelpIcon fontSize="small" className={ classes.grey } style={{ marginBottom: '-5px' }} />
                      </Grid>
                      <Grid item xs>
                        <Typography variant="h5" className={ classes.grey } >
                          Inactive
                        </Typography>
                      </Grid>
                  </Grid>
                  </Tooltip>
                </div>
              }

            </div>
          </AccordionSummary>
          <AccordionDetails className={ classes.removePadding }>
            <Asset asset={ asset } startLoading={ this.startLoading } basedOn={ basedOn } />
          </AccordionDetails>
        </Accordion>
      )
    })
  }

  renderFilters = () => {
    const { loading, search, searchError, hideZero } = this.state
    const { classes } = this.props

    return (
      <div className={ classes.filters }>
        <FormControlLabel
          className={ classes.checkbox }
          control={
            <Checkbox
              checked={ hideZero }
              onChange={ this.handleChecked }
              color='primary'
            />
          }
          label="Hide zero balances"
        />
        <div className={ classes.between }>
          <Tooltip title={
              <React.Fragment>
                <Typography variant={'h5'} className={ classes.fees }>
                  There is a 0.5% withdrawal fee on all vaults.<br /><br />
                  There is a 5% performance fee on subsidized gas.
                </Typography>
              </React.Fragment>
            } arrow>
            <InfoIcon />
          </Tooltip>
        </div>
        <TextField
          fullWidth
          disabled={ loading }
          className={ classes.searchField }
          id={ 'search' }
          value={ search }
          error={ searchError }
          onChange={ this.onSearchChanged }
          placeholder="ETH, CRV, ..."
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="end" className={ classes.inputAdornment }><SearchIcon /></InputAdornment>,
          }}
        />
      </div>
    )
  }

  handleChecked = (event) => {
    this.setState({ hideZero: event.target.checked })
    localStorage.setItem('yearn.finance-hideZero', (event.target.checked ? '1' : '0' ))
  }

  handleChange = (id) => {
    this.setState({ expanded: this.state.expanded === id ? null : id })
  }

  startLoading = () => {
    this.setState({ loading: true })
  }

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };

  _getAPY = (asset) => {
    const { basedOn } = this.state
    const initialApy = '0.00'

    if(asset && asset.stats && asset.stats.apyOneWeekSample) {
      switch (basedOn) {
        case 1:
          return asset.stats.apyOneWeekSample || initialApy
        case 2:
          return asset.stats.apyOneMonthSample || initialApy
        case 3:
          return asset.stats.apyInceptionSample || initialApy
        default:
          return asset.apy
      }
    } else if (asset.apy) {
      return asset.apy
    } else {
      return initialApy
    }
  }

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
        <InfoIcon className={ classes.infoIcon } />
        <Typography>Growth is based on the vault's performance { basedOn === 3 ? 'since' : 'for the past' }</Typography>
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
                <Typography variant='h4'>{ option.description }</Typography>
              </MenuItem>
            )
          })
        }
      </TextField>
      </div>
    )
  }

  renderStrategyRewards = () => {

    const { classes } = this.props

    return( 
          <div className={ classes.disaclaimer } style={{ marginTop: '25px', maxWidth: '500px' }}>

            <Grid container spacing={1}>
              <Grid item><TimelineIcon fontsize="small" /></Grid>
              <Grid item xs>
                <Typography variant="h4" style={{ display: 'inline', fontWeight: 'bold' }}>
                Strategy Rewards
                </Typography>
              </Grid>
            </Grid>

            <Typography variant="body1">
              Yearn is only possible due to community contributions. Vault strategy contributors are rewarded with <b>0.5%</b> of yield generated by the vault. <a href="https://docs.yearn.finance/faq#what-are-the-fees" rel="noopener noreferrer" target="_blank">Learn more &rarr;</a>
            </Typography>
          </div>
    )
  }

  onSelectChange = (event) => {
    let val = []
    val[event.target.name] = event.target.value
    this.setState(val)

    localStorage.setItem('yearn.finance-dashboard-basedon', event.target.value)

    this.setState({ loading: true })
    dispatcher.dispatch({ type: GET_VAULT_BALANCES_FULL, content: {} })
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Vault)));
