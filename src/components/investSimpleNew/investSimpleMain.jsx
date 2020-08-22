import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
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
  Paper
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withNamespaces } from 'react-i18next';
import { colors } from '../../theme'

import InvestAllModal from './investAllModalNew.jsx'
import UnlockModal from '../unlock/unlockModal.jsx'
import Snackbar from '../snackbar'
import Asset from './assetNew'
import Loader from '../loader'

import {
  ERROR,
  GET_BALANCES,
  BALANCES_RETURNED,
  INVEST_RETURNED,
  REDEEM_RETURNED,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
} from '../../constants'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  root: {
  },
  investedContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100%',
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '32px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
    }
  },
  introCenter: {
    maxWidth: '500px',
    textAlign: 'center',
    display: 'flex',
    padding: '48px 0px'
  },
  introCenterDark: {
    maxWidth: '500px',
    textAlign: 'center',
    display: 'flex',
    padding: '48px 0px',
    color: '#fff'
  },
  introText: {
    paddingLeft: '20px'
  },
  actionButton: {
    fontWeight: '600',
    fontSize: '16px',
    lineLeight: '24px',
    padding: '8px 13px',
    margin: '15px 8px 0',
    borderRadius: '4px',
    boxShadow: 'none',
    '&:first-of-type': {
      marginLeft: '0',
    },
    '&:last-of-type': {
      marginRight: '0',
    },
  },
  pulsingButton: {
    animation: '$pulse-animation 2s infinite'
  },
  '@keyframes pulse-animation': {
    '0%': {
      boxShadow: '0 0 0 0px rgba(47, 128, 237, 0.5)'
    },
    '100%': {
      boxShadow: '0 0 0 10px rgba(47, 128, 237, 0)'
    }
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
    }
  },
  heading: {
    display: 'none',
    paddingTop: '12px',
    flex: 1,
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      paddingTop: '5px',
      display: 'block'
    }
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
    maxWidth: 'calc(100vw - 24px)',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '100%',
      maxWidth: 'auto'
    }
  },
  between: {
    width: '40px',
    height: '40px'
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
  assetContainer: {
    position: 'relative',
    width: '100%',
    background: '#fff',
    height: '100%',
  },
  tableContainer: {
    padding: '70px 0 87px',
  },
  table: {
    maxWidth: '695px',
    width: '100%',
    margin: '0 auto',
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
    borderColor: '#F3F4F5',
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
  groupButton: {
    fontWeight: '600',
    fontSize: '16px',
    lineLeight: '24px',
    borderRadius: '4px',
    background: '#fff',
    '& .MuiToggleButtonGroup-groupedHorizontal:not(:last-child)': {
      borderTopLeftRadius: '0',
      borderBottomLeftRadius: '0',
    },
    '& .MuiToggleButtonGroup-groupedHorizontal:not(:first-child)': {
      borderTopRightRadius: '0',
      borderBottomRightRadius: '0',
    }
  },
  groupButtonDark: {
    fontWeight: '600',
    fontSize: '16px',
    lineLeight: '24px',
    borderRadius: '4px',
    background: '#373B42',
    '& .MuiToggleButtonGroup-groupedHorizontal:not(:last-child)': {
      borderTopLeftRadius: '0',
      borderBottomLeftRadius: '0',
    },
    '& .MuiToggleButtonGroup-groupedHorizontal:not(:first-child)': {
      borderTopRightRadius: '0',
      borderBottomRightRadius: '0',
    }
  },
  darkBg: {
    backgroundImage: `url(${require('../../assets/bg-dark.png')})`,
    height: '50%',
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    zIndex: '1',
  },
  mainDarkBg: {
    backgroundImage: `url(${require('../../assets/bg-dark.png')})`,
    backgroundPosition: 'left bottom',
    height: '50%',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    zIndex: '1',
  },
  tableContainerDark: {
    padding: '70px 0 87px',
    backgroundImage: `url(${require('../../assets/bg-dark.png')})`,
  },
  tableCellDark: {
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '22px',
    color: '#FFF',
    padding: '8px 16px',
    borderColor: '#535963',
  },
  tableRowDark: {
    borderBottom: '1px solid #535963',
    cursor: 'pointer',
    '&:hover': {
      background: '#535963',
    }
  },
  tableRowCellDark: {
    padding: '8px 16px',
    borderColor: '#535963'
  },
  assetDescriptionDark: {
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#FFF',
  },
  assetTitleDark: {
    fontWeight: '600',
    fontSize: '20px',
    lineHeight: '24px',
    color: '#fff',
    marginLeft: '6px',
  },
});

class InvestSimple extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')
    props.setAccountGlobal(account)
    const assets = store.getStore('assets')
    console.log({assets})
    this.state = {
      assets,
      currentAsset: assets.find(a => a.id === 'DAI') || assets[0],
      account: account,
      modalOpen: false,
      modalInvestAllOpen: false,
      snackbarType: null,
      snackbarMessage: null,
      hideV1: true,
      value: 1,
      refreshTimer: null
    }

    if(account && account.address) {
      dispatcher.dispatch({ type: GET_BALANCES, content: {} })
    }

    this.tableRef = React.createRef()
  }
  componentWillMount() {
    emitter.on(INVEST_RETURNED, this.investReturned);
    emitter.on(REDEEM_RETURNED, this.redeemReturned);
    emitter.on(ERROR, this.errorReturned);
    emitter.on(BALANCES_RETURNED, this.balancesReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);

  }

  componentWillUnmount() {
    const { refreshTimer } = this.state
    clearTimeout(refreshTimer)
    emitter.removeListener(INVEST_RETURNED, this.investReturned);
    emitter.removeListener(REDEEM_RETURNED, this.redeemReturned);
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(BALANCES_RETURNED, this.balancesReturned);
  };

  refresh() {
    dispatcher.dispatch({ type: GET_BALANCES, content: {} })
  }

  balancesReturned = (balances) => {
    const _refreshTimer = setTimeout(this.refresh, 30000)
    this.setState({ assets: store.getStore('assets'), refreshTimer: _refreshTimer })
  };

  connectionConnected = () => {
    const { t, setAccountGlobal} = this.props
    const account = store.getStore('account')
    this.setState({ account })
    setAccountGlobal(account)
    dispatcher.dispatch({ type: GET_BALANCES, content: {} })

    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: t("Unlock.WalletConnected"), snackbarType: 'Info' }
      that.setState(snackbarObj)
    })
  };

  connectionDisconnected = () => {
    const { setAccountGlobal} = this.props
    const { refreshTimer } = this.state
    const account = store.getStore('account')
    clearTimeout(refreshTimer)
    this.setState({ account, refreshTimer: null })
    setAccountGlobal(account)
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

  investReturned = (txHash) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  };

  redeemReturned = (txHash) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  };

  scrollToMyRef = () => window.scrollTo({
    top: this.tableRef.current.offsetTop,
    behavior: "smooth"
  })

  render() {
    const { classes, t, isDarkTheme } = this.props;
    const {
      loading,
      account,
      modalOpen,
      modalInvestAllOpen,
      snackbarMessage,
      value,
      currentAsset,
    } = this.state
    
    return (
      <div className={ classes.root }>
        <div className={ classes.investedContainer }>
          { !account.address &&
          <div className={ isDarkTheme ? classes.introCenterDark : classes.introCenter }>
            <Typography variant='h3'>{ t('InvestSimple.Intro') }</Typography>
          </div>
          }
          {!account.address &&
            <div className={ classes.connectContainer }>
              <Button
                className={`${classes.actionButton} ${classes.pulsingButton}`}
                variant="contained"
                color="primary"
                disabled={ loading }
                onClick={ this.overlayClicked }
              >
                <Typography className={ classes.buttonText } variant={ 'h5'}>{ t('InvestSimple.Connect') }</Typography>
              </Button>
            </div>
          }
          { account.address &&
            <div className={ classes.intro }>
              <ToggleButtonGroup className={ isDarkTheme ? classes.groupButtonDark : classes.groupButton } value={value} onChange={this.handleTabChange} aria-label="contained primary button group" variant="contained" exclusive size={ 'small' }>
                <ToggleButton value={0}>
                  <Typography style={{color: isDarkTheme && '#fff'}} variant={ 'h4' }>v1</Typography>
                </ToggleButton>
                <ToggleButton value={1}>
                  <Typography style={{color: isDarkTheme && '#fff'}} variant={ 'h4' }>y.curve.fi</Typography>
                </ToggleButton>
                <ToggleButton value={2}>
                  <Typography style={{color: isDarkTheme && '#fff'}} variant={ 'h4' }>busd.curve.fi</Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          }
          {account.address && (
            <>
              <div className={classes.assetContainer}>
                <div className={classes.wavesBg} />
                <Asset asset={currentAsset} startLoading={this.startLoading} isDarkTheme={isDarkTheme} scrollToMyRef={this.scrollToMyRef} />
                <div className={isDarkTheme ? classes.darkBg : classes.whiteBg}  />
                  <div className={isDarkTheme ? classes.mainDarkBg : classes.mainBg}  />
              </div>
            </>
          )}
          {account.address && (
              <TableContainer ref={this.tableRef} className={ isDarkTheme ? classes.tableContainerDark : classes.tableContainer} component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell className={ isDarkTheme ? classes.tableCellDark : classes.tableCell }>Asset</TableCell>
                      <TableCell className={ isDarkTheme ? classes.tableCellDark : classes.tableCell }>Details</TableCell>
                      <TableCell className={ isDarkTheme ? classes.tableCellDark : classes.tableCell }>Interest Rate</TableCell>
                      <TableCell className={ isDarkTheme ? classes.tableCellDark : classes.tableCell }>Available Balance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { account.address && value === 0 && this.renderAssetBlocksv1() }
                    { account.address && value === 1 && this.renderAssetBlocksv2() }
                    { account.address && value === 2 && this.renderAssetBlocksv3() }
                  </TableBody>
                </Table>
              </TableContainer>
            )}
        </div>
        { loading && <Loader /> }
        { modalOpen && this.renderModal() }
        { modalInvestAllOpen && this.renderInvestAllModal() }
        { snackbarMessage && this.renderSnackbar() }
      </div>
    )
  };

  handleTabChange = (event, newValue) => {
    this.setState({ value: newValue })
  };

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.checked
    this.setState(val)
  };

  renderAssetBlocksv1 = () => {
    const { assets, hideV1, currentAsset } = this.state
    const { classes, isDarkTheme } = this.props
    return assets.filter((asset) => {
      return (hideV1 === false || asset.version !== 1)
    }).filter((asset) => {
      return (asset.version === 1 && asset.investedBalance && (asset.investedBalance).toFixed(4) > 0)
    }).filter((asset) => {
      return !(asset.symbol === "iDAI")
    }).map((asset) => {
      return (
        <TableRow 
          style={isDarkTheme ? { background: currentAsset.id === asset.id ? '#373B42' : 'inherit'} : { background: currentAsset.id === asset.id ? '#E6F7FF' : 'inherit'}}
          className={isDarkTheme ? classes.tableRowDark : classes.tableRow}
          key={asset.id} 
          onClick={() => this.setState({ currentAsset: asset })}>
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
            <Typography className={isDarkTheme ? classes.assetTitleDark : classes.assetTitle} variant="h6">{asset.id}</Typography>
          </TableCell>
          <TableCell className={isDarkTheme ? classes.tableRowCellDark : classes.tableRowCell}>
            <Typography className={ isDarkTheme ? classes.assetDescriptionDark : classes.assetDescription } variant="h6">{asset.description}</Typography>
          </TableCell>
          <TableCell className={isDarkTheme ? classes.tableRowCellDark : classes.tableRowCell}>
            <Typography className={ isDarkTheme ? classes.assetDescriptionDark : classes.assetDescription } variant="h6">{ asset.maxApr ? (asset.maxApr * 100).toFixed(4) + ' %' : 'N/A' }</Typography>
          </TableCell>
          <TableCell className={isDarkTheme ? classes.tableRowCellDark : classes.tableRowCell}>
            <Typography className={ isDarkTheme ? classes.assetDescriptionDark : classes.assetDescription } variant="h6">{ asset.balance ? (asset.balance).toFixed(4) + ' ' + (asset.tokenSymbol ? asset.tokenSymbol : asset.symbol) : 'N/A' }</Typography>
          </TableCell>
        </TableRow>
      )
    })
  }

  renderAssetBlocksv2 = () => {
    const { assets, currentAsset } = this.state
    const { classes, isDarkTheme } = this.props
    return assets.filter((asset) => {
      return (asset.version === 2)
    }).filter((asset) => {
      return !(asset.symbol === "iDAI")
    }).map((asset) => {
      return (
        <TableRow 
          style={isDarkTheme ? { background: currentAsset.id === asset.id ? '#373B42' : 'inherit'} : { background: currentAsset.id === asset.id ? '#E6F7FF' : 'inherit'}}
          className={isDarkTheme ? classes.tableRowDark : classes.tableRow}
          key={asset.id} 
          onClick={() => this.setState({ currentAsset: asset })}>
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
            <Typography className={isDarkTheme ? classes.assetTitleDark : classes.assetTitle} variant="h6">{asset.id}</Typography>
          </TableCell>
          <TableCell className={isDarkTheme ? classes.tableRowCellDark : classes.tableRowCell}>
            <Typography className={ isDarkTheme ? classes.assetDescriptionDark : classes.assetDescription } variant="h6">{asset.description}</Typography>
          </TableCell>
          <TableCell className={isDarkTheme ? classes.tableRowCellDark : classes.tableRowCell}>
            <Typography className={ isDarkTheme ? classes.assetDescriptionDark : classes.assetDescription } variant="h6">{ asset.maxApr ? (asset.maxApr * 100).toFixed(4) + ' %' : 'N/A' }</Typography>
          </TableCell>
          <TableCell className={isDarkTheme ? classes.tableRowCellDark : classes.tableRowCell}>
            <Typography className={ isDarkTheme ? classes.assetDescriptionDark : classes.assetDescription } variant="h6">{ asset.balance ? (asset.balance).toFixed(4) + ' ' + (asset.tokenSymbol ? asset.tokenSymbol : asset.symbol) : 'N/A' }</Typography>
          </TableCell>
        </TableRow>
      )
    })
  }

  renderAssetBlocksv3 = () => {
    const { assets, currentAsset } = this.state
    const { classes, isDarkTheme } = this.props
    return assets.filter((asset) => {
      return (asset.version === 3)
    }).filter((asset) => {
      return !(asset.symbol === "iDAI")
    }).map((asset) => {
      return (
        <TableRow 
          style={isDarkTheme ? { background: currentAsset.id === asset.id ? '#373B42' : 'inherit'} : { background: currentAsset.id === asset.id ? '#E6F7FF' : 'inherit'}}
          className={isDarkTheme ? classes.tableRowDark : classes.tableRow}
          key={asset.id} 
          onClick={() => this.setState({ currentAsset: asset })}>
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
            <Typography className={isDarkTheme ? classes.assetTitleDark : classes.assetTitle} variant="h6">{asset.id}</Typography>
          </TableCell>
          <TableCell className={isDarkTheme ? classes.tableRowCellDark : classes.tableRowCell}>
            <Typography className={ isDarkTheme ? classes.assetDescriptionDark : classes.assetDescription } variant="h6">{asset.description}</Typography>
          </TableCell>
          <TableCell className={isDarkTheme ? classes.tableRowCellDark : classes.tableRowCell}>
            <Typography className={ isDarkTheme ? classes.assetDescriptionDark : classes.assetDescription } variant="h6">{ asset.maxApr ? (asset.maxApr * 100).toFixed(4) + ' %' : 'N/A' }</Typography>
          </TableCell>
          <TableCell className={isDarkTheme ? classes.tableRowCellDark : classes.tableRowCell}>
            <Typography className={ isDarkTheme ? classes.assetDescriptionDark : classes.assetDescription } variant="h6">{ asset.balance ? (asset.balance).toFixed(4) + ' ' + (asset.tokenSymbol ? asset.tokenSymbol : asset.symbol) : 'N/A' }</Typography>
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
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }

  renderInvestAllModal = () => {
    return (
      <InvestAllModal closeModal={ this.closeInvestAllModal } modalOpen={ this.state.modalInvestAllOpen } assets={ this.state.assets } />
    )
  }

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  investAllClicked = () => {
    this.setState({ modalInvestAllOpen: true })
  }

  closeInvestAllModal = () => {
    this.setState({ modalInvestAllOpen: false })
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(InvestSimple)));
