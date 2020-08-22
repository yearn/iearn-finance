import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import {
  Card,
  Typography,
  Button,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { withNamespaces } from 'react-i18next'
import { colors } from '../../theme'

import UnlockModal from '../unlock/unlockModal.jsx'
import Snackbar from '../snackbar'
import Asset from './assetNew'
import Loader from '../loader'

import {
  ERROR,
  GET_POOL_BALANCES,
  POOL_BALANCES_RETURNED,
  DEPOSIT_POOL_RETURNED,
  WITHDRAW_POOL_RETURNED,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
} from '../../constants'

import Store from '../../stores'
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = (theme) => ({
  root: {
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
    },
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
    },
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
    },
  },
  introCenter: {
    maxWidth: '500px',
    textAlign: 'center',
    display: 'flex',
    padding: '48px 0px',
  },
  introText: {
    paddingLeft: '20px',
  },
  actionButton: {
    '&:hover': {
      backgroundColor: '#2F80ED',
    },
    padding: '12px',
    backgroundColor: '#2F80ED',
    border: '1px solid #E1E1E1',
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      padding: '15px',
    },
  },
  overlay: {
    position: 'absolute',
    borderRadius: '10px',
    background: 'RGBA(200, 200, 200, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #aaa',
    cursor: 'pointer',

    right: '0px',
    top: '10px',
    height: '70px',
    width: '160px',
    [theme.breakpoints.up('md')]: {
      right: '0px',
      top: '10px',
      height: '90px',
      width: '210px',
    },
  },
  heading: {
    display: 'none',
    paddingTop: '12px',
    flex: 1,
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      paddingTop: '5px',
      display: 'block',
    },
  },
  headingName: {
    paddingTop: '5px',
    flex: 2,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    minWidth: '100%',
    [theme.breakpoints.up('sm')]: {
      minWidth: 'auto',
    },
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
      flexWrap: 'nowrap',
    },
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
    },
  },
  addressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
    flex: 1,
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    textOverflow: 'ellipsis',
    cursor: 'pointer',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid ' + colors.borderBlue,
    alignItems: 'center',
    maxWidth: '450px',
    [theme.breakpoints.up('md')]: {
      width: '100%',
    },
  },
  between: {
    width: '40px',
  },
  expansionPanel: {
    maxWidth: 'calc(100vw - 24px)',
    width: '100%',
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
    alignItems: 'center',
  },
  investAllContainer: {
    paddingTop: '24px',
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
  },
  disaclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    marginBottom: '24px',
    lineHeight: '1.2',
  },
  fees: {
    paddingRight: '75px',
    padding: '12px',
    lineHeight: '1.2',
  },
  walletAddress: {
    padding: '0px 12px',
  },
  walletTitle: {
    flex: 1,
    color: colors.darkGray,
  },
  grey: {
    color: colors.darkGray,
  },
  wavesBg: {
    backgroundImage: `url(${require('../../assets/bg-waves.svg')})`,
    height: '38px',
    width: '100%',
    position: 'absolute',
    top: '50%',
    left: '0',
    zIndex: '2',
    marginTop: '-38px'
  },
  assetContainer: {
    position: 'relative',
    width: '100%',
    background: '#fff',
    height: '100%',
  },
  whiteBg: {
    background: '#fff',
    height: '50%',
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    zIndex: '1',
  },
  mainBg: {
    backgroundImage: `url(${require(`../../assets/bg.png`)})`,
    backgroundPosition: 'left bottom',
    height: '50%',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    zIndex: '1',
  },
  table: {
    maxWidth: '967px',
    width: '100%',
    margin: '0 auto',
  },
  tableCell: {
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '22px',
    color: '#252626',
    padding: '8px 16px',

  },
  tableAvatarCell: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    height: '65px',
    borderBottom: 'none',
  },
  tableAvatar: {
    marginLeft: '20px',
    background: 'transparent'
  },
  assetTitle: {
    fontWeight: '600',
    fontSize: '20px',
    lineHeight: '24px',
    color: '#080809',
    marginLeft: '6px',
  },
  tableRowCell: {
    padding: '8px 16px',
    borderColor: '#F3F4F5'
  },
  tableRow: {
    borderBottom: '1px solid #F3F4F5',
    cursor: 'pointer',
    '&:hover': {
      background: '#E6F7FF',
    }
  },
  assetDescription: {
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#575859',
  },
  assetDescriptionBalance: {
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#096DD9',
  },
  tableContainer: {
    padding: '70px 0 87px',
  },
})

class PoolMain extends Component {
  constructor(props) {
    super()

    const account = store.getStore('account')
    props.setAccountGlobal(account)
    const assets = store.getStore('poolAssets')

    this.state = {
      assets,
      currentAsset: assets[0],
      account: account,
      modalOpen: false,
      snackbarType: null,
      snackbarMessage: null,
      value: 1,
      refreshTimer: null
    }

    if (account && account.address) {
      dispatcher.dispatch({ type: GET_POOL_BALANCES, content: {} })
    }

    this.tableRef = React.createRef()
  }
  componentWillMount() {
    emitter.on(DEPOSIT_POOL_RETURNED, this.showHash)
    emitter.on(WITHDRAW_POOL_RETURNED, this.showHash)
    emitter.on(ERROR, this.errorReturned)
    emitter.on(POOL_BALANCES_RETURNED, this.balancesReturned)
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected)
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected)
  }

  componentWillUnmount() {
    const { refreshTimer } = this.state
    clearTimeout(refreshTimer)
    emitter.removeListener(DEPOSIT_POOL_RETURNED, this.showHash)
    emitter.removeListener(WITHDRAW_POOL_RETURNED, this.showHash)
    emitter.removeListener(ERROR, this.errorReturned)
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected)
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected)
    emitter.removeListener(POOL_BALANCES_RETURNED, this.balancesReturned)
  }

  refresh() {
    dispatcher.dispatch({ type: GET_POOL_BALANCES, content: {} })
  }

  balancesReturned = (balances) => {
    const _refreshTimer = setTimeout(this.refresh, 30000)
    this.setState({ assets: store.getStore('poolAssets'), refreshTimer: _refreshTimer })
  }

  connectionConnected = () => {
    const { t, setAccountGlobal } = this.props
    const acc = store.getStore('account')
    this.setState({ account: acc })
    setAccountGlobal(acc)

    dispatcher.dispatch({ type: GET_POOL_BALANCES, content: {} })

    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: t('Unlock.WalletConnected'), snackbarType: 'Info' }
      that.setState(snackbarObj)
    })
  }

  connectionDisconnected = () => {
    const { setAccountGlobal } = this.props
    const { refreshTimer } = this.state
    clearTimeout(refreshTimer)
    const acc = store.getStore('account')
    this.setState({ account: acc, refreshTimer: null })
    setAccountGlobal(acc)
    console.log('DISCONNECTED')
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
  }

  showHash = (txHash) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  }

  scrollToMyRef = () => window.scrollTo({
    top: this.tableRef.current.offsetTop,
    behavior: "smooth"
  })

  render() {
    const { classes, t } = this.props
    const { loading, account, modalOpen, snackbarMessage, currentAsset } = this.state

    var address = null
    if (account.address) {
      address =
        account.address.substring(0, 6) +
        '...' +
        account.address.substring(account.address.length - 4, account.address.length)
    }

    return (
      <>
        
        <div className={classes.root}>
          <div className={classes.investedContainer}>
            {!account.address && (
              <div className={classes.introCenter}>
                <Typography variant="h3">Vaults. Simple.</Typography>
              </div>
            )}
            {!account.address && (
              <div className={classes.connectContainer}>
                <Button
                  className={classes.actionButton}
                  variant="outlined"
                  color="primary"
                  disabled={loading}
                  onClick={this.overlayClicked}
                >
                  <Typography className={classes.buttonText} variant={'h5'}>
                    {t('InvestSimple.Connect')}
                  </Typography>
                </Button>
              </div>
            )}
            
            {account.address && (
              <>
                <div className={classes.assetContainer}>
                  <div className={classes.wavesBg} />
                  <Asset asset={currentAsset} startLoading={this.startLoading} scrollToMyRef={this.scrollToMyRef} />
                  <div className={classes.whiteBg}  />
                  <div className={classes.mainBg}  />
                </div>
              </>
            )}
            {account.address && (
              <TableContainer ref={this.tableRef} className={classes.tableContainer} component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableCell}>Asset</TableCell>
                      <TableCell className={classes.tableCell}>Details</TableCell>
                      <TableCell className={classes.tableCell}>Annialized ROI</TableCell>
                      <TableCell className={classes.tableCell}>Wallet Balance</TableCell>
                      <TableCell className={classes.tableCell}>Deployed Balance</TableCell>
                      <TableCell className={classes.tableCell}>LP Token Balance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{this.renderAssetBlocks()}</TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
          {loading && <Loader />}
          {modalOpen && this.renderModal()}
          {snackbarMessage && this.renderSnackbar()}
        </div>
      </>
    )
  }

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.checked
    this.setState(val)
  }

  renderAssetBlocks = () => {
    const { assets, expanded, currentAsset } = this.state
    const { classes } = this.props
    const width = window.innerWidth

    return assets.map((asset) => {
      return (
        <TableRow
          style={{ background: currentAsset.id === asset.id ? '#E6F7FF' : 'inherit'}}
          className={classes.tableRow}
          key={asset.id}
          onClick={() => this.setState({ currentAsset: asset })}
        >
          <TableCell className={classes.tableAvatarCell} component="th" scope="row">
            <img src={require(`../../assets/${currentAsset.id === asset.id ? 'check' : 'no-check'}.svg`)} alt="" />
            <Avatar className={classes.tableAvatar}>
              <img
                alt=""
                src={require('../../assets/' + asset.symbol + '-logo.png')}
                height={'24px'}
                style={asset.disabled ? { filter: 'grayscale(100%)' } : {}}
              />
            </Avatar>
            <Typography className={classes.assetTitle} variant="h6">{asset.id}</Typography>
          </TableCell>
          <TableCell className={classes.tableRowCell} align="left">
            <Typography className={classes.assetDescription} variant="h6">{asset.description}</Typography>
          </TableCell>
          <TableCell className={classes.tableRowCell} align="left">
            <Typography className={classes.assetDescription} variant="h6">{['LINK'].includes(asset.id) ? 'Not Available' : `${asset.apy ? asset.apy.toFixed(4) : '0.0000'}%`}</Typography>
          </TableCell>
          <TableCell className={classes.tableRowCell} align="left">
            <Typography className={classes.assetDescription} variant="h6">{(asset.balance ? asset.balance.toFixed(4) : '0.0000') + ' ' + asset.symbol}</Typography>
          </TableCell>
          <TableCell
            style={{ background: currentAsset.id === asset.id ? '#BAE7FF' : 'inherit', borderBottom: '1px solid #BAE7FF' }}
            className={classes.tableRowCell}
            align="left"
          >
            <Typography className={classes.assetDescriptionBalance} variant="h6">{asset.pooledBalance
              ? (Math.floor(asset.pooledBalance * asset.pricePerFullShare * 10000) / 10000).toFixed(4)
              : '0.0000'}{' '}
              {asset.symbol}
            </Typography>
          </TableCell>
          <TableCell className={classes.tableRowCell} align="left">
            <Typography className={classes.assetDescription} variant="h6">{asset.pooledBalance ? (Math.floor(asset.pooledBalance * 10000) / 10000).toFixed(4) : '0.0000'}{' '}
              {asset.poolSymbol}
            </Typography>
          </TableCell>
        </TableRow>
      )
    })
  }

  handleChange = (id) => {
    this.setState({ expanded: this.state.expanded === id ? null : id })
  }

  startLoading = () => {
    this.setState({ loading: true })
  }

  renderSnackbar = () => {
    var { snackbarType, snackbarMessage } = this.state
    return <Snackbar type={snackbarType} message={snackbarMessage} open={true} />
  }

  renderModal = () => {
    return <UnlockModal closeModal={this.closeModal} modalOpen={this.state.modalOpen} />
  }

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(PoolMain)))
