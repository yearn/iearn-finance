import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Tooltip
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import InfoIcon from '@material-ui/icons/Info';
import { withNamespaces } from 'react-i18next';
import { colors } from '../../theme'

import Snackbar from '../snackbar'
import Asset from './asset'
import Loader from '../loader'

import {
  ERROR,
  GET_VAULT_BALANCES,
  VAULT_BALANCES_RETURNED,
  DEPOSIT_VAULT_RETURNED,
  WITHDRAW_VAULT_RETURNED,
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
    background: colors.white
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
  }
});

class Vault extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')

    this.state = {
      assets: store.getStore('vaultAssets'),
      account: account,
      address: account.address ? account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length) : null,
      snackbarType: null,
      snackbarMessage: null,
      search: '',
      searchError: false,
      hideZero: localStorage.getItem('yearn.finance-hideZero') === '1' ? true : false
    }

    if(account && account.address) {
      dispatcher.dispatch({ type: GET_VAULT_BALANCES, content: {} })
    }
  }
  componentWillMount() {
    emitter.on(DEPOSIT_VAULT_RETURNED, this.showHash);
    emitter.on(WITHDRAW_VAULT_RETURNED, this.showHash);
    emitter.on(ERROR, this.errorReturned);
    emitter.on(VAULT_BALANCES_RETURNED, this.balancesReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
  }

  componentWillUnmount() {
    emitter.removeListener(DEPOSIT_VAULT_RETURNED, this.showHash);
    emitter.removeListener(WITHDRAW_VAULT_RETURNED, this.showHash);
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(VAULT_BALANCES_RETURNED, this.balancesReturned);
  };

  refresh() {
    dispatcher.dispatch({ type: GET_VAULT_BALANCES, content: {} })
  }

  balancesReturned = (balances) => {
    this.setState({ assets: store.getStore('vaultAssets') })
    setTimeout(this.refresh, 300000);
  };

  connectionConnected = () => {
    const { t } = this.props
    const account = store.getStore('account')
    this.setState({
      account: account,
      address: account.address ? account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length) : null
    })

    dispatcher.dispatch({ type: GET_VAULT_BALANCES, content: {} })

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
          { this.renderAssetBlocks() }
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
    const { assets, expanded, search, hideZero } = this.state
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
                (!['LINK'].includes(asset.id) && asset.vaultBalance > 0) &&
                <div className={classes.headingEarning}>
                  <Typography variant={ 'h5' } className={ classes.grey }>You are earning:</Typography>
                  <div className={ classes.flexy }>
                    <Typography variant={ 'h3' } noWrap>{ (asset.apy ? (asset.apy).toFixed(2) : '0.00') }% </Typography>
                    <Typography variant={ 'h5' } className={ classes.on }> on </Typography>
                    <Typography variant={ 'h3' } noWrap>{ (asset.vaultBalance ? (asset.vaultBalance).toFixed(2) : '0.00') } {asset.vaultSymbol}</Typography>
                  </div>
                </div>
              }
              {
                (!['LINK'].includes(asset.id) && asset.vaultBalance === 0) &&
                <div className={classes.headingEarning}>
                  <Typography variant={ 'h5' } className={ classes.grey }>This vault is earning:</Typography>
                  <div className={ classes.flexy }>
                    <Typography variant={ 'h3' } noWrap>{ (asset.apy ? (asset.apy).toFixed(2) : '0.00') }% </Typography>
                  </div>
                </div>
              }
              {
                ['LINK'].includes(asset.id) &&
                <div className={classes.headingEarning}>
                  <Typography variant={ 'h5' } className={ classes.grey }>You are earning:</Typography>
                  <Typography variant={ 'h3' } noWrap>Not Available</Typography>
                </div>
              }
              <div className={classes.heading}>
                <Typography variant={ 'h5' } className={ classes.grey }>Available to deposit:</Typography>
                <Typography variant={ 'h3' } noWrap>{ (asset.balance ? (asset.balance).toFixed(2) : '0.00')+' '+asset.symbol }</Typography>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Asset asset={ asset } startLoading={ this.startLoading } />
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
}

export default withNamespaces()(withRouter(withStyles(styles)(Vault)));
