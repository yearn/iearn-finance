import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Grid
} from '@material-ui/core';
import { colors } from '../../theme'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

import {
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  CONFIGURE_COVER,
  CONFIGURE_COVER_RETURNED,
  GET_COVER_BALANCES,
  COVER_BALANCES_RETURNED,
} from '../../constants'

import * as moment from 'moment';
import Loader from '../loader'
import Snackbar from '../snackbar'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  root: {
    flex: 1,
    width: '100%',
    marginTop: '60px',
    maxWidth: '1000px',
  },
  tableContainer: {
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    background: colors.white,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginBottom: '40px'
  },
  assetSelectIcon: {
    marginRight: '24px'
  },
  assetName: {
    display: 'flex',
    alignItems: 'center'
  },
  claimType: {
    color: colors.darkGray
  },
  actionButton: {
    borderRadius: '6px',
    width: '160px',
    height: '30px',
    fontSize: '14px'
  },
  disclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    lineHeight: '1.2',
    background: colors.white,
  },
  disclaimerContainer: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  maxCellHeight: {
    height: '60px',
    padding: '0px'
  }
});

class NewCover extends Component {

  constructor() {
    super()

    const account = store.getStore('account')

    this.state = {
      account: account,
      coverProtocols: store.getStore('coverProtocols'),
      loading: true,
      page: 0,
      rowsPerPage: 5,
      snackbarType: null,
      snackbarMessage: null,
    }

    dispatcher.dispatch({ type: CONFIGURE_COVER })
  }

  componentWillMount() {
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(CONFIGURE_COVER_RETURNED, this.configureCoverReturned);
    emitter.on(COVER_BALANCES_RETURNED, this.coverBalancesReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(CONFIGURE_COVER_RETURNED, this.configureCoverReturned);
    emitter.removeListener(COVER_BALANCES_RETURNED, this.coverBalancesReturned);
  };

  connectionConnected = () => {
    this.setState({
      account: store.getStore('account'),
      loading: true
    })

    dispatcher.dispatch({ type: GET_COVER_BALANCES })
  };

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account') })
  }

  configureCoverReturned = () => {

    const { account } = this.state

    this.setState({
      coverProtocols: store.getStore('coverProtocols'),
      loading: false
    })

    if(account && account.address) {
      dispatcher.dispatch({ type: GET_COVER_BALANCES })
    }
  }

  coverBalancesReturned = () => {
    this.setState({
      coverCollateral: store.getStore('coverCollateral'),
      coverAssets: store.getStore('coverAssets'),
      coverProtocols: store.getStore('coverProtocols'),
      loading: false
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
  };

  render() {
    const { classes } = this.props
    const {
      loading,
      snackbarMessage,
    } = this.state

    return (
      <div className={ classes.root }>
        <div className={ classes.tableContainer} >
          { this.renderCoverTable() }
        </div>
        <div className={ classes.disclaimerContainer }>
          <div className={ classes.disclaimer } style={{ marginTop: '25px', maxWidth: '500px' }}>
            <Grid container spacing={1}>
              <Grid item><VerifiedUserIcon fontSize="small" /></Grid>
              <Grid item xs>
                <Typography variant="h4" style={{ display: 'inline', fontWeight: 'bold' }}>
                CLAIMS
                </Typography>
              </Grid>
            </Grid>
            <Typography variant="body1">
              To find out more about how claims are assessed and paid out, go to <a href="https://docs.coverprotocol.com/product/claims-guidelines" rel="noopener noreferrer" target="_blank">Cover Protocol's claim guidelines</a>
            </Typography>
          </div>
        </div>
        { loading && <Loader /> }
        { snackbarMessage && this.renderSnackbar() }
      </div>
    )
  };

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };

  renderCoverTable = () =>  {

    const { classes } = this.props
    const { coverProtocols, page, rowsPerPage } = this.state

    return (
      <React.Fragment>
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Asset</TableCell>
                <TableCell align="right">Expiry Date</TableCell>
                <TableCell align="right">Balance</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { this.renderCover() }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={ coverProtocols ? coverProtocols.filter((asset) => {
            if(!asset) {
              return false
            }

            if(asset.claimAsset && asset.claimAsset.balance > 0) {
              return true
            }

            if(asset.noClaimAsset && asset.noClaimAsset.balance > 0) {
              return true
            }

            return false
          }).length : 0 }
          rowsPerPage={ rowsPerPage }
          page={ page }
          onChangePage={ this.handleChangePage }
          onChangeRowsPerPage={ this.handleChangeRowsPerPage }
        />
      </React.Fragment>
    )
  }

  renderCover = () => {
    const { classes } = this.props
    const {
      coverProtocols,
      page,
      rowsPerPage
    } = this.state

    if(!coverProtocols || coverProtocols.length === 0) {
      return <TableRow className={ classes.optionRow } key={'No'}>
        <TableCell colSpan={9} align="center">
          <Typography>You don't have any cover tokens</Typography>
        </TableCell>
      </TableRow>
    }
    const filteredRows = coverProtocols.filter((asset) => {
      if(!asset) {
        return false
      }

      if(asset.claimAsset && asset.claimAsset.balance > 0) {
        return true
      }

      if(asset.noClaimAsset && asset.noClaimAsset.balance > 0) {
        return true
      }

      return false
    })
    
    return filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((asset) => {
      return (
        <React.Fragment>
          { asset.claimAsset && asset.claimAsset.balance > 0 &&
            <TableRow className={ classes.optionRow } key={`${asset.name}_claim`} >
              <TableCell>
                <div className={ classes.assetName }>
                  <img
                    alt=""
                    className={ classes.assetSelectIcon }
                    src={ this.getLogoForProtocol({ name: asset.name }) }
                    height="30px"
                  />
                  <div className={ classes.assetSelectIconName }>
                    <Typography variant='h4'>{ asset.name }</Typography>
                    <Typography variant='h5' className={ classes.claimType }>Claim Token</Typography>
                  </div>
                </div>
              </TableCell>
              <TableCell align="right"><Typography variant='h4'>{ asset.expires ? moment(asset.expires*1e3).format("YYYY/MM/DD") : '' }</Typography></TableCell>
              <TableCell align="right">
                <div>
                  <Typography variant='h4'>{ asset.claimAsset && asset.claimAsset.balance ? (asset.claimAsset.balance).toFixed(2) : '0' }</Typography>
                  <Typography variant='h4' className={ classes.claimType }>${ asset.claimPoolData && asset.claimPoolData.price ? (asset.claimPoolData.price * asset.claimAsset.balance).toFixed(2) : '0' }</Typography>
                </div>
                </TableCell>
              <TableCell align="center">
                <Tooltip title="Claims are handled on Cover Protocol's app">
                  <Button
                    className={ classes.actionButton }
                    variant='contained'
                    color='primary'
                    onClick={ () => { this.onClaim(asset) } }
                  >
                    File Claim
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          }
          { asset.noClaimAsset && asset.noClaimAsset.balance > 0 &&
            <TableRow className={ classes.optionRow } key={`${asset.name}_noclaim`} >
              <TableCell>
                <div className={ classes.assetName }>
                  <img
                    alt=""
                    className={ classes.assetSelectIcon }
                    src={ this.getLogoForProtocol({ name: asset.name }) }
                    height="30px"
                  />
                  <div className={ classes.assetSelectIconName }>
                    <Typography variant='h4'>{ asset.name }</Typography>
                    <Typography variant='h5' className={ classes.claimType }>No Claim Token</Typography>
                  </div>
                </div>
              </TableCell>
              <TableCell align="right"><Typography variant='h4'>{ asset.expires ? moment(asset.expires*1e3).format("YYYY/MM/DD") : '' }</Typography></TableCell>
              <TableCell align="right">
                <div>
                  <Typography variant='h4'>{ asset.noClaimAsset && asset.noClaimAsset.balance ? (asset.noClaimAsset.balance).toFixed(2) : '0' }</Typography>
                  <Typography variant='h4' className={ classes.claimType }>${ asset.noClaimPoolData && asset.noClaimPoolData.price ? (asset.noClaimPoolData.price * asset.noClaimAsset.balance).toFixed(2) : '0' }</Typography>
                </div>
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Redemptions are handled on Cover Protocol's app">
                  <Button
                    className={ classes.actionButton }
                    variant='contained'
                    color='primary'
                    onClick={ () => { this.onRedeem(asset) } }
                  >
                    Redeem
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          }
        </React.Fragment>
      )
    })
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage })
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10), page: 0 })
  };

  getLogoForProtocol = (protocol) => {
    try {
      return require(`../../assets/cover/${protocol.name.toLowerCase()}_icon.png`);
    } catch {
      return require('../../assets/unknown-logo.png')
    }
  }

  onClaim = (asset) => {
    window.open(`https://app.coverprotocol.com/app/claims/new?protocol=${asset.name}`, '_blank')
  }

  onRedeem = (asset) => {
    window.open(`https://app.coverprotocol.com/app/dashboard`, '_blank')
  }
}

export default withStyles(styles)(NewCover);
