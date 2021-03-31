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
  Tooltip,
  MenuItem,
  Grid
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import InfoIcon from '@material-ui/icons/Info';
import { withNamespaces } from 'react-i18next';
import { colors, drawerWidth } from '../../theme'

import Snackbar from '../snackbar'
import Asset from './asset'
import Loader from '../loader'

import {
  ERROR,
  DEPOSIT_CONTRACT_RETURNED,
  WITHDRAW_VAULT_RETURNED,
  DEPOSIT_ALL_CONTRACT_RETURNED,
  WITHDRAW_BOTH_VAULT_RETURNED,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  GET_STRATEGY_BALANCES_FULL,
  STRATEGY_BALANCES_FULL_RETURNED,
} from '../../constants'

import Store from "../../stores";
import UnlockModal from "../unlock/unlockModal";
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
  investedContainerLoggedOut: {
  },
  investedContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: '100%',
    marginTop: '20px',
    marginBottom: '40px',
    [theme.breakpoints.up('md')]: {
      minWidth: '900px',
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: '90%',
      margin: 'auto',
      marginTop: '40px',
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
    display: 'block',
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
      height: '32px',
      width: '32px',
      marginRight: '12px',
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
    [theme.breakpoints.down('sm')]: {
      width: '85%',
    }
  },
  strategyContainer: {
    border: '1px solid #d9d9d9',
    borderRadius: '10px',
    padding: '1rem',
    marginBottom: '20px',
    [theme.breakpoints.down('sm')]: {
      width: '95%',
      margin: 'auto',
      marginBottom: '20px',
    }
  },
  riskLowLabel: {
    background: '#72C6AE',
    borderRadius: '5px',
    color: '#ffffff',
    padding: '5px 10px',
    textAlign: 'center',
    width: '5rem',
    marginLeft: 'auto'
  },
  riskMediumLabel: {
    background: '#EC9956',
    borderRadius: '5px',
    color: '#ffffff',
    padding: '5px 10px',
    textAlign: 'center',
    width: '7rem',
    marginLeft: 'auto'
  },
  assetName: {
    color: '#222222',
    fontSize: '1rem'
  },
  assetLabel: {
    color: '#888888',
    fontSize: '1rem',
    fontWeight: 600
  },
  assetValue: {
    color: '#222222',
    fontSize: '1rem',
    fontWeight: 600
  },
  gridItemColumn: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '5px',
      alignItems: 'stretch',
    }
  },
  roundIconClass: {
    background: 'rgba(24, 160, 251, 0.1)', 
    color: '#A7c0d6',
    borderRadius: '50%'
  },
  showDesktop: {
    display: 'block',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  showMobile: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'block'
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
      loading: true,
      expanded: '',
      modalOpen: false,
    }

    if(account && account.address) {
      dispatcher.dispatch({ type: GET_STRATEGY_BALANCES_FULL, content: { interval: '30d' } })
    }
  }

  componentWillMount() {
    emitter.on(DEPOSIT_CONTRACT_RETURNED, this.showHash);
    emitter.on(WITHDRAW_VAULT_RETURNED, this.showHash);
    emitter.on(DEPOSIT_ALL_CONTRACT_RETURNED, this.showHash);
    emitter.on(WITHDRAW_BOTH_VAULT_RETURNED, this.showHash);
    emitter.on(ERROR, this.errorReturned);
    emitter.on(STRATEGY_BALANCES_FULL_RETURNED, this.balancesReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
  }

  componentWillUnmount() {
    emitter.removeListener(DEPOSIT_CONTRACT_RETURNED, this.showHash);
    emitter.removeListener(WITHDRAW_VAULT_RETURNED, this.showHash);
    emitter.removeListener(DEPOSIT_ALL_CONTRACT_RETURNED, this.showHash);
    emitter.removeListener(WITHDRAW_BOTH_VAULT_RETURNED, this.showHash);
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(STRATEGY_BALANCES_FULL_RETURNED, this.balancesReturned);
  };

  balancesReturned = (balances) => {
    this.setState({
      assets: store.getStore('vaultAssets'),
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

    dispatcher.dispatch({ type: GET_STRATEGY_BALANCES_FULL, content: { interval: '30d' } })

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
      modalOpen,
    } = this.state

    if(!account || !account.address) {
      return (
        <div className={ classes.root }>
          <div className={classes.connectWalletContainer}>
            <div className={ classes.investedContainerLoggedOut }>
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
          { snackbarMessage && this.renderSnackbar() }
          { modalOpen && this.renderModal() }
        </div>
      )
    }

    return (
      <div className={ classes.root }>
        <div className={classes.contentContainer}>
          <div className={ classes.investedContainer }>
            {/* <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>
            { this.renderFilters() }
            { this.renderBasedOn() } */}
            {/* { this.renderChart() } */}
            { this.renderAssetBlocks() }
          </div>
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
    }).map((asset, index) => {
      return (
        <div key={index} className={classes.strategyContainer}>
          <Grid container>
            <Grid item sm={6} xs={6} style={{display: 'flex', alignItems: 'center'}}>
              <Typography variant='h4'>Strategy {index+1}: {asset.strategyName}</Typography>
            </Grid>
            <Grid item sm={6} xs={6}>
              {this.renderRiskLabel(asset)}
            </Grid>
          </Grid>
          <Accordion className={ classes.expansionPanel } square key={ asset.id+"_expand" } expanded={ expanded === asset.id} onChange={ () => { this.handleChange(asset.id, asset) } }>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon className={classes.roundIconClass} />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <div className={ classes.assetSummary }>
                <Grid container>
                  <Grid item sm={2} xs={6} className={classes.gridItemColumn}>
                    <div className={classes.assetIcon}>
                      <img
                          alt=""
                          src={ require('../../assets/'+asset.symbol+'-logo.'+asset.logoFormat) }
                          height={ '32px' }
                          style={asset.disabled?{filter:'grayscale(100%)'}:{}}
                        />
                    </div>
                    <Typography variant={ 'body1' } noWrap className={classes.assetName}>{ asset.name }</Typography>
                  </Grid>
                  <Grid item sm={2} xs={6} className={classes.gridItemColumn}>
                    <Typography variant={ 'body1' } className={ classes.assetLabel }>{ asset.description }</Typography>
                  </Grid>
                  <Grid item sm={3} xs={6} className={classes.gridItemColumn}>
                  {
                    (!['LINK'].includes(asset.id) && asset.vaultBalance > 0) &&
                    <div>
                      <div className={classes.showDesktop}>
                        <Typography variant={ 'h5' } className={ classes.assetLabel }>Yearly Growth: <span style={{color: '#222222'}}>{ (this._getAPY(asset)/1).toFixed(2) }%</span></Typography>
                      </div>  
                      <div className={classes.showMobile}>
                        <Typography variant={ 'h5' } className={ classes.assetLabel }>Yearly Growth: </Typography>
                        <Typography variant={ 'h3' } noWrap className={classes.assetValue}>{ (this._getAPY(asset)/1).toFixed(2) }%</Typography>
                      </div>
                    </div>   
                  }
                  {
                    (!['LINK'].includes(asset.id) && asset.vaultBalance === 0) &&
                      <div>
                        <div className={classes.showDesktop}>
                        <Typography variant={ 'h5' } className={ classes.assetLabel }>Yearly Growth: <span style={{color: '#222222'}}>
                            { (this._getAPY(asset)/1).toFixed(2) }%
                          </span>
                        </Typography>
                        </div>  
                        <div className={classes.showMobile}>
                          <Typography variant={ 'h5' } className={ classes.assetLabel }>Yearly Growth: </Typography>
                          <Typography variant={ 'h3' } noWrap className={classes.assetValue}>{ (this._getAPY(asset)/1).toFixed(2) }%</Typography>
                        </div>
                      </div>   
                  }
                  </Grid>
                  <Grid item sm={5} xs={6} className={classes.gridItemColumn}>
                    <div className={classes.showDesktop}>
                      <Typography variant={ 'h5' } className={ classes.assetLabel }>Available to deposit: <span style={{color: '#222222'}}>
                          { (asset.balance ? (asset.balance).toFixed(2) : '0.00')+' '+asset.symbol }
                        </span>
                      </Typography>
                    </div>
                    <div className={classes.showMobile}>
                      <Typography variant={ 'h5' } className={ classes.assetLabel }>Available to deposit: </Typography>
                      <Typography variant={ 'h3' } noWrap className={classes.assetValue}>{ (asset.balance ? (asset.balance).toFixed(2) : '0.00')+' '+asset.symbol }</Typography>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </AccordionSummary>
            <AccordionDetails className={ classes.removePadding }>
              <Asset asset={ asset } startLoading={ this.startLoading } basedOn={ basedOn } />
            </AccordionDetails>
          </Accordion>
        </div>
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

  renderRiskLabel = (asset) => {
    const { classes } = this.props;
    return (
      <div className={asset.risk === 'Low' ? classes.riskLowLabel : asset.risk === 'Medium' ? classes.riskMediumLabel : '' }>
        <Typography variant='caption'>Risk: {asset.risk}</Typography>
      </div>
    );
  }

  handleChecked = (event) => {
    this.setState({ hideZero: event.target.checked })
    localStorage.setItem('yearn.finance-hideZero', (event.target.checked ? '1' : '0' ))
  }

  handleChange = (id, asset) => {
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

  onSelectChange = (event) => {
    let val = []
    val[event.target.name] = event.target.value
    this.setState(val)

    localStorage.setItem('yearn.finance-dashboard-basedon', event.target.value)

    this.setState({ loading: true })
    dispatcher.dispatch({ type: GET_STRATEGY_BALANCES_FULL, content: { interval: '30d' } })
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

export default withNamespaces()(withRouter(withStyles(styles)(Vault)));
